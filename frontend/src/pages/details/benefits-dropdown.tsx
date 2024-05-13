import { Autocomplete, Box, TextField } from "@mui/material"
import { useList } from "@refinedev/core"
import { type Case } from "../../types"

interface BenefitsDropdownProps {
  benefits: string[]
  updateBenefits: (update: string[]) => void
  editable: boolean
}

function titleCapitalize(words: string) {
  return words
    .split(" ")
    .map((word) => word[0]?.toUpperCase() + word.substring(1))
    .join(" ")
}

export default function BenefitsDropdown({ benefits, updateBenefits, editable }: BenefitsDropdownProps) {
  const { data, isLoading, isError } = useList<Case>({
    resource: "cases",
  })

  if (isError) {
    return <div color="black">Something went wrong!</div>
  }

  const benefitList = data?.data?.flatMap((value) => value.benefits) ?? []
  const benefitSet = new Set(benefitList.concat(benefits))

  return (
    <Box sx={{ marginLeft: 0.25, marginRight: 0.25, marginBottom: 0.3 }}>
      <Autocomplete
        multiple
        id="benefit-dropdown"
        freeSolo={true}
        options={[...benefitSet]}
        loading={isLoading}
        getOptionLabel={(option) => titleCapitalize(option)}
        isOptionEqualToValue={(option, value) => option.toLowerCase() == value.toLowerCase()}
        value={benefits}
        onChange={(_, value) => updateBenefits(value.map((val) => titleCapitalize(val)))}
        renderInput={(params) => <TextField {...params} variant="standard" label="Benefits" />}
        style={{ paddingBottom: 4, opacity: 0.8 }}
        readOnly={!editable}
      />
    </Box>
  )
}
