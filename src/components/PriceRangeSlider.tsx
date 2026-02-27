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
          sx={{
            "& .MuiInputBase-input": {
              color: (theme) =>
                theme.palette.mode === "dark" ? "#fff" : "#000",
            },
          }}
        />

        <TextField
          fullWidth
          size="small"
          label="Max"
          type="number"
          value={priceMax}
          onChange={(e) => onPriceMaxChange(Number(e.target.value))}
          sx={{
            "& .MuiInputBase-input": {
              color: (theme) =>
                theme.palette.mode === "dark" ? "#fff" : "#000",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default PriceRangeSlider;
