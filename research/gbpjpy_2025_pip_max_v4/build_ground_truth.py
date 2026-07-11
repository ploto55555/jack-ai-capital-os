from __future__ import annotations

import argparse
import zipfile
from pathlib import Path

import pandas as pd

COLUMNS = ["date", "time", "open", "high", "low", "close", "volume"]


def load_histdata(zip_path: Path) -> pd.DataFrame:
    with zipfile.ZipFile(zip_path) as archive:
        csv_names = [name for name in archive.namelist() if name.lower().endswith(".csv")]
        if len(csv_names) != 1:
            raise ValueError(f"Expected one CSV in archive, found {csv_names}")
        with archive.open(csv_names[0]) as handle:
            frame = pd.read_csv(handle, header=None, names=COLUMNS)

    frame["timestamp"] = pd.to_datetime(
        frame["date"] + " " + frame["time"], format="%Y.%m.%d %H:%M", errors="raise"
    )
    frame = frame.set_index("timestamp").sort_index()

    if frame.index.has_duplicates:
        raise ValueError("Duplicate M1 timestamps found")
    if frame[["open", "high", "low", "close"]].isna().any().any():
        raise ValueError("Missing OHLC values found")
    if not ((frame["high"] >= frame[["open", "close", "low"]].max(axis=1)) &
            (frame["low"] <= frame[["open", "close", "high"]].min(axis=1))).all():
        raise ValueError("Invalid OHLC geometry found")

    return frame[["open", "high", "low", "close", "volume"]]


def resample_completed(frame: pd.DataFrame, rule: str) -> pd.DataFrame:
    result = frame.resample(rule, label="right", closed="right").agg(
        open=("open", "first"),
        high=("high", "max"),
        low=("low", "min"),
        close=("close", "last"),
        volume=("volume", "sum"),
    )
    return result.dropna()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("zip_path", type=Path)
    parser.add_argument("--output", type=Path, default=Path("outputs/ground_truth"))
    args = parser.parse_args()

    args.output.mkdir(parents=True, exist_ok=True)
    m1 = load_histdata(args.zip_path)

    summary = pd.DataFrame(
        [{
            "m1_rows": len(m1),
            "first_timestamp": m1.index.min(),
            "last_timestamp": m1.index.max(),
            "duplicate_timestamps": int(m1.index.duplicated().sum()),
            "missing_ohlc_rows": int(m1[["open", "high", "low", "close"]].isna().any(axis=1).sum()),
        }]
    )
    summary.to_csv(args.output / "data_quality_summary.csv", index=False)

    for name, rule in {"m5": "5min", "m15": "15min", "h1": "1h", "h4": "4h"}.items():
        bars = resample_completed(m1, rule)
        bars.to_csv(args.output / f"gbpjpy_2025_{name}.csv")

    focus = m1.loc["2025-04-03":"2025-04-09 23:59:59"]
    focus.to_csv(args.output / "gbpjpy_2025_04_03_09_m1.csv")

    print(summary.to_string(index=False))


if __name__ == "__main__":
    main()
