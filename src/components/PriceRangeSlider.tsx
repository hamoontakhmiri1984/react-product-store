import { Box, Slider, TextField } from "@mui/material";

type PriceRangeSliderProps = {
  priceMin: number;
  priceMax: number;
  onPriceMinChange: (value: number) => void;
  onPriceMaxChange: (value: number) => void;
  min?: number;
  max?: number;
};

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "transparent",
    "& fieldset": { borderColor: "#94a3b8" },
    "&:hover fieldset": { borderColor: "#64748b" },
    "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
  },
  ".dark & .MuiOutlinedInput-root": {
    backgroundColor: "#1e293b",
    "& fieldset": { borderColor: "#475569" },
    "&:hover fieldset": { borderColor: "#94a3b8" },
    "&.Mui-focused fieldset": { borderColor: "#60a5fa" },
  },
  "& .MuiInputBase-input": { color: "#000000" },
  ".dark & .MuiInputBase-input": { color: "#ffffff" },
  "& .MuiInputLabel-root": { color: "#475569" },
  ".dark & .MuiInputLabel-root": { color: "#cbd5e1" },
} as const;

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

export default function PriceRangeSlider({
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
  min = 0,
  max = 1000,
}: PriceRangeSliderProps) {
  const handleSliderChange = (_: unknown, newValue: number | number[]) => {
    if (!Array.isArray(newValue)) return;
    const nextMin = clamp(newValue[0], min, max);
    const nextMax = clamp(newValue[1], min, max);
    onPriceMinChange(Math.min(nextMin, nextMax));
    onPriceMaxChange(Math.max(nextMin, nextMax));
  };

  const handleMinInput = (raw: string) => {
    const n = Number(raw);
    if (!Number.isFinite(n)) return;
    const nextMin = clamp(n, min, max);
    onPriceMinChange(Math.min(nextMin, priceMax));
  };

  const handleMaxInput = (raw: string) => {
    const n = Number(raw);
    if (!Number.isFinite(n)) return;
    const nextMax = clamp(n, min, max);
    onPriceMaxChange(Math.max(nextMax, priceMin));
  };

  return (
    <Box sx={{ width: "100%", px: 1 }}>
      <Slider
        value={[priceMin, priceMax]}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        valueLabelFormat={(v) => `$${v}`}
        min={min}
        max={max}
        sx={{ mb: 3 }}
        aria-label="Price range"
      />

      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          fullWidth
          size="small"
          label="Min"
          type="number"
          value={priceMin}
          onChange={(e) => handleMinInput(e.target.value)}
          sx={textFieldSx}
          inputProps={{ min, max }}
        />

        <TextField
          fullWidth
          size="small"
          label="Max"
          type="number"
          value={priceMax}
          onChange={(e) => handleMaxInput(e.target.value)}
          sx={textFieldSx}
          inputProps={{ min, max }}
        />
      </Box>
    </Box>
  );
}
