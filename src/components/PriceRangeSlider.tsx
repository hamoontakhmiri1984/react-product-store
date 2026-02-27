import { Slider, Box, TextField } from "@mui/material";

type PriceRangeSliderProps = {
  priceMin: number;
  priceMax: number;
  onPriceMinChange: (value: number) => void;
  onPriceMaxChange: (value: number) => void;
};

const PriceRangeSlider = ({
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
}: PriceRangeSliderProps) => {
  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      onPriceMinChange(newValue[0]);
      onPriceMaxChange(newValue[1]);
    }
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "transparent",

      "& fieldset": {
        borderColor: "#94a3b8",
      },

      "&:hover fieldset": {
        borderColor: "#64748b", // light hover
      },

      "&.Mui-focused fieldset": {
        borderColor: "#3b82f6",
      },
    },

    ".dark & .MuiOutlinedInput-root": {
      backgroundColor: "#1e293b", // slate-800

      "& fieldset": {
        borderColor: "#475569",
      },

      "&:hover fieldset": {
        borderColor: "#94a3b8", // softer hover (نه مشکی)
      },

      "&.Mui-focused fieldset": {
        borderColor: "#60a5fa",
      },
    },
    "& .MuiInputBase-input": {
      color: "#000000",
    },
    ".dark & .MuiInputBase-input": {
      color: "#ffffff",
    },
    "& .MuiInputLabel-root": {
      color: "#475569",
    },
    ".dark & .MuiInputLabel-root": {
      color: "#cbd5e1",
    },
  };

  return (
    <Box sx={{ width: "100%", px: 1 }}>
      <Slider
        value={[priceMin, priceMax]}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => `$${value}`}
        min={0}
        max={1000}
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          fullWidth
          size="small"
          label="Min"
          type="number"
          value={priceMin}
          onChange={(e) => onPriceMinChange(Number(e.target.value))}
          sx={textFieldSx}
        />

        <TextField
          fullWidth
          size="small"
          label="Max"
          type="number"
          value={priceMax}
          onChange={(e) => onPriceMaxChange(Number(e.target.value))}
          sx={textFieldSx}
        />
      </Box>
    </Box>
  );
};

export default PriceRangeSlider;
