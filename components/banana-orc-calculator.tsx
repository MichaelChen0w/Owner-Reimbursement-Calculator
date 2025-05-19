"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Calculator } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ORCSummary } from "@/components/orc-summary"
import { ORCBreakdown } from "@/components/orc-breakdown"
import { defaultValues, calculateORC } from "@/lib/orc-calculator"
import { MobileTooltip } from "@/components/mobile-tooltip"

// 添加作物到作物类型的映射
const cropToCropTypeMapping: Record<string, { type: string; category?: string; subType?: string }> = {
  // Perennial Crops
  banana: { type: "perennial", category: "banana" },
  "sugar-cane": { type: "perennial", category: "sugar-cane" },

  // Tree/Vine/Nut Crops - Fruit Trees
  apple: { type: "tree-vine-nut", subType: "fruit-trees", category: "fruitType" },
  pear: { type: "tree-vine-nut", subType: "fruit-trees", category: "fruitType" },
  quince: { type: "tree-vine-nut", subType: "fruit-trees", category: "fruitType" },
  peach: { type: "tree-vine-nut", subType: "fruit-trees", category: "fruitType" },
  plum: { type: "tree-vine-nut", subType: "fruit-trees", category: "fruitType" },
  cherry: { type: "tree-vine-nut", subType: "fruit-trees", category: "fruitType" },
  apricot: { type: "tree-vine-nut", subType: "fruit-trees", category: "fruitType" },
  nectarine: { type: "tree-vine-nut", subType: "fruit-trees", category: "fruitType" },
  orange: { type: "tree-vine-nut", subType: "fruit-trees", category: "fruitType" },
  lemon: { type: "tree-vine-nut", subType: "fruit-trees", category: "fruitType" },
  lime: { type: "tree-vine-nut", subType: "fruit-trees", category: "fruitType" },
  mandarin: { type: "tree-vine-nut", subType: "fruit-trees", category: "fruitType" },
  grapefruit: { type: "tree-vine-nut", subType: "fruit-trees", category: "fruitType" },
  mango: { type: "tree-vine-nut", subType: "fruit-trees", category: "fruitType" },
  avocado: { type: "tree-vine-nut", subType: "fruit-trees", category: "fruitType" },
  papaya: { type: "tree-vine-nut", subType: "fruit-trees", category: "fruitType" },

  // Tree/Vine/Nut Crops - Vine Crops
  grapes: { type: "tree-vine-nut", subType: "vine-crops", category: "vineType" },
  kiwifruit: { type: "tree-vine-nut", subType: "vine-crops", category: "vineType" },
  passionfruit: { type: "tree-vine-nut", subType: "vine-crops", category: "vineType" },

  // Tree/Vine/Nut Crops - Nut Crops
  almonds: { type: "tree-vine-nut", subType: "nut-crops", category: "nutType" },
  walnuts: { type: "tree-vine-nut", subType: "nut-crops", category: "nutType" },
  pistachios: { type: "tree-vine-nut", subType: "nut-crops", category: "nutType" },
  macadamias: { type: "tree-vine-nut", subType: "nut-crops", category: "nutType" },
  hazelnuts: { type: "tree-vine-nut", subType: "nut-crops", category: "nutType" },
  pecans: { type: "tree-vine-nut", subType: "nut-crops", category: "nutType" },

  // Tree/Vine/Nut Crops - Bare Root Stock
  "nursery-stock": { type: "tree-vine-nut", subType: "bare-root", category: "bareRootType" },
  "large-plants": { type: "tree-vine-nut", subType: "bare-root", category: "bareRootType" },
  "nursery-root-stock": { type: "tree-vine-nut", subType: "bare-root", category: "bareRootType" },
  "nursery-large-rooted-plants": { type: "tree-vine-nut", subType: "bare-root", category: "bareRootType" },

  // Annual Broad Acre Crops
  wheat: { type: "annual-broad-acre", category: "grainType" },
  barley: { type: "annual-broad-acre", category: "grainType" },
  oats: { type: "annual-broad-acre", category: "grainType" },
  rye: { type: "annual-broad-acre", category: "grainType" },
  rice: { type: "annual-broad-acre", category: "grainType" },
  maize: { type: "annual-broad-acre", category: "grainType" },
  sorghum: { type: "annual-broad-acre", category: "grainType" },
  millet: { type: "annual-broad-acre", category: "grainType" },
  soybeans: { type: "annual-broad-acre", category: "grainType" },
  chickpeas: { type: "annual-broad-acre", category: "grainType" },
  lentils: { type: "annual-broad-acre", category: "grainType" },
  "field-peas": { type: "annual-broad-acre", category: "grainType" },
  "faba-beans": { type: "annual-broad-acre", category: "grainType" },
  "mung-beans": { type: "annual-broad-acre", category: "grainType" },
  canola: { type: "annual-broad-acre", category: "grainType" },
  sunflower: { type: "annual-broad-acre", category: "grainType" },
  safflower: { type: "annual-broad-acre", category: "grainType" },
  linseed: { type: "annual-broad-acre", category: "grainType" },
  cotton: { type: "annual-broad-acre", category: "grainType" },
  "sugar-beet": { type: "annual-broad-acre", category: "grainType" },
  alfalfa: { type: "annual-broad-acre", category: "grainType" },

  // Annual Short Rotation Crops - Vegetables
  lettuce: { type: "annual-short-rotation", subType: "vegetables", category: "vegetableType" },
  spinach: { type: "annual-short-rotation", subType: "vegetables", category: "vegetableType" },
  kale: { type: "annual-short-rotation", subType: "vegetables", category: "vegetableType" },
  arugula: { type: "annual-short-rotation", subType: "vegetables", category: "vegetableType" },
  carrots: { type: "annual-short-rotation", subType: "vegetables", category: "vegetableType" },
  radishes: { type: "annual-short-rotation", subType: "vegetables", category: "vegetableType" },
  beets: { type: "annual-short-rotation", subType: "vegetables", category: "vegetableType" },
  turnips: { type: "annual-short-rotation", subType: "vegetables", category: "vegetableType" },
  tomatoes: { type: "annual-short-rotation", subType: "vegetables", category: "vegetableType" },
  cucumbers: { type: "annual-short-rotation", subType: "vegetables", category: "vegetableType" },
  "bell-peppers": { type: "annual-short-rotation", subType: "vegetables", category: "vegetableType" },
  eggplants: { type: "annual-short-rotation", subType: "vegetables", category: "vegetableType" },
  onions: { type: "annual-short-rotation", subType: "vegetables", category: "vegetableType" },
  garlic: { type: "annual-short-rotation", subType: "vegetables", category: "vegetableType" },
  leeks: { type: "annual-short-rotation", subType: "vegetables", category: "vegetableType" },
  "green-beans": { type: "annual-short-rotation", subType: "vegetables", category: "vegetableType" },
  "snap-peas": { type: "annual-short-rotation", subType: "vegetables", category: "vegetableType" },
  zucchini: { type: "annual-short-rotation", subType: "vegetables", category: "vegetableType" },
  pumpkins: { type: "annual-short-rotation", subType: "vegetables", category: "vegetableType" },
  melons: { type: "annual-short-rotation", subType: "vegetables", category: "vegetableType" },

  // Annual Short Rotation Crops - Strawberries
  strawberries: { type: "annual-short-rotation", subType: "strawberries" },

  // Annual Short Rotation Crops - Nursery
  seedlings: { type: "annual-short-rotation", subType: "nursery", category: "nurseryType" },
  "plug-stock": { type: "annual-short-rotation", subType: "nursery", category: "nurseryType" },
  "potted-color": { type: "annual-short-rotation", subType: "nursery", category: "nurseryType" },
  "trees-shrubs": { type: "annual-short-rotation", subType: "nursery", category: "nurseryType" },
  "foliage-plants": { type: "annual-short-rotation", subType: "nursery", category: "nurseryType" },
  "mother-stock": { type: "annual-short-rotation", subType: "nursery", category: "nurseryType" },
}

export function BananaORCCalculator() {
  const [formData, setFormData] = useState(defaultValues)
  const [results, setResults] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("crop-selection")

  const tabsListRef = useRef<HTMLDivElement>(null)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleCropSelect = (crop: string) => {
    const mapping = cropToCropTypeMapping[crop]
    if (mapping) {
      const newFormData = { ...formData, cropType: mapping.type }

      // 设置相应的子类型
      if (mapping.category) {
        newFormData[mapping.category] = crop
      }

      // 设置子类型
      if (mapping.subType) {
        if (mapping.type === "tree-vine-nut") {
          newFormData.treeType = mapping.subType
        } else if (mapping.type === "annual-short-rotation") {
          newFormData.shortRotationType = mapping.subType
        }
      }

      setFormData(newFormData)
    }
  }

  // Update the basic information tab to use cropVariety instead of variety

  // First, update the useEffect for banana variety and region
  useEffect(() => {
    if (formData.cropType !== "perennial" || formData.cropCategory !== "banana") return

    // Only update yield and price if they are currently 0
    if (formData.yield === 0 || formData.price === 0) {
      let newYield = 0
      let newPrice = 0

      // Set yield and price based on variety and region
      if (formData.cropVariety === "cavendish" && formData.region === "wet-tropics") {
        newYield = 35
        newPrice = 1528.39
      } else if (formData.cropVariety === "lady-finger" && formData.region === "dry-tropics") {
        newYield = 22.5
        newPrice = 2087
      } else if (formData.cropVariety === "cavendish" && formData.region === "sub-tropics") {
        newYield = 15
        newPrice = 1528.39
      } else if (formData.cropVariety === "ducasse" && formData.region === "sub-tropics") {
        newYield = 10
        newPrice = 1800
      } else if (formData.cropVariety === "cavendish" && formData.region === "dry-tropics") {
        newYield = 29
        newPrice = 1528.39
      }

      setFormData((prev) => ({
        ...prev,
        yield: newYield,
        price: newPrice,
      }))
    }
  }, [formData.cropVariety, formData.region, formData.yield, formData.price, formData.cropType, formData.cropCategory])

  // Update default values for annual broad acre crops
  useEffect(() => {
    if (formData.cropType !== "annual-broad-acre") return

    // Only update yield and price if they are currently 0
    if (formData.yield === 0 || formData.price === 0) {
      let newYield = 0
      let newPrice = 0

      // Set yield and price based on grain type
      if (formData.grainType === "wheat") {
        newYield = 2.5
        newPrice = 350
      } else if (formData.grainType === "barley") {
        newYield = 2.8
        newPrice = 280
      } else if (formData.grainType === "canola") {
        newYield = 1.8
        newPrice = 650
      } else if (formData.grainType === "cotton") {
        newYield = 2.2
        newPrice = 550
      }

      setFormData((prev) => ({
        ...prev,
        yield: newYield,
        price: newPrice,
      }))
    }
  }, [formData.grainType, formData.yield, formData.price, formData.cropType])

  // Add default values for tree/vine crops
  useEffect(() => {
    if (formData.cropType !== "tree-vine-nut") return

    // Only update values if they are currently 0
    if (formData.yield === 0 || formData.price === 0) {
      let newYield = 0
      let newPrice = 0
      let newRotationPeriod = 0
      let newNonBearingPeriod = 0

      // Set values based on tree/vine type
      if (formData.treeType === "fruit-trees") {
        if (formData.fruitType === "apple") {
          newYield = 40
          newPrice = 1200
          newRotationPeriod = 25
          newNonBearingPeriod = 3
        } else if (formData.fruitType === "orange") {
          newYield = 35
          newPrice = 850
          newRotationPeriod = 30
          newNonBearingPeriod = 4
        } else if (formData.fruitType === "mango") {
          newYield = 15
          newPrice = 2500
          newRotationPeriod = 40
          newNonBearingPeriod = 5
        }
      } else if (formData.treeType === "vine-crops") {
        if (formData.vineType === "grapes") {
          newYield = 12
          newPrice = 1800
          newRotationPeriod = 20
          newNonBearingPeriod = 3
        } else if (formData.vineType === "kiwifruit") {
          newYield = 25
          newPrice = 2200
          newRotationPeriod = 15
          newNonBearingPeriod = 2
        }
      } else if (formData.treeType === "nut-crops") {
        if (formData.nutType === "almonds") {
          newYield = 3
          newPrice = 8000
          newRotationPeriod = 25
          newNonBearingPeriod = 4
        } else if (formData.nutType === "macadamias") {
          newYield = 3.5
          newPrice = 6000
          newRotationPeriod = 40
          newNonBearingPeriod = 7
        }
      }

      setFormData((prev) => ({
        ...prev,
        yield: newYield,
        price: newPrice,
        rotationPeriod: newRotationPeriod,
        nonBearingPeriod: newNonBearingPeriod,
        destructionCosts: 2000, // Default destruction costs for trees/vines
        replantingCosts: 15000, // Default replanting costs for trees/vines
        grossMargin: 8000, // Default gross margin for trees/vines
      }))
    }
  }, [
    formData.treeType,
    formData.fruitType,
    formData.vineType,
    formData.nutType,
    formData.yield,
    formData.price,
    formData.cropType,
  ])

  // Add the new useEffect for short rotation crops default values
  // Add this after the existing useEffect hooks
  useEffect(() => {
    if (formData.cropType !== "annual-short-rotation") return

    // Only update yield and price if they are currently 0
    if (formData.yield === 0 || formData.price === 0) {
      let newYield = 0
      let newPrice = 0
      let newUnitType = "weight"
      let newUnitCount = 0
      let newGrossMargin = 0

      // Set yield and price based on short rotation type
      if (formData.shortRotationType === "vegetables") {
        if (formData.vegetableType === "lettuce" || formData.vegetableType === "spinach") {
          newYield = 25
          newPrice = 1500
          newGrossMargin = 15000
        } else if (formData.vegetableType === "tomatoes" || formData.vegetableType === "bell-peppers") {
          newYield = 40
          newPrice = 2000
          newGrossMargin = 25000
        } else if (formData.vegetableType === "carrots" || formData.vegetableType === "onions") {
          newYield = 35
          newPrice = 800
          newGrossMargin = 12000
        } else {
          newYield = 20
          newPrice = 1200
          newGrossMargin = 10000
        }
      } else if (formData.shortRotationType === "strawberries") {
        newYield = 15
        newPrice = 6000
        newGrossMargin = 30000
      } else if (formData.shortRotationType === "nursery") {
        // Nursery is often count-based rather than weight-based
        newUnitType = "count"
        newUnitCount = 100000 // e.g., 100,000 seedlings per hectare
        newPrice = 0.5 // e.g., $0.50 per seedling
        newGrossMargin = 20000
      }

      setFormData((prev) => ({
        ...prev,
        yield: newYield,
        price: newPrice,
        unitType: newUnitType,
        unitCount: newUnitCount,
        grossMargin: newGrossMargin,
        packagingCosts: 1000, // Default packaging costs
        treatmentCosts: 500, // Default treatment costs
        glassHouseCosts: formData.shortRotationType === "nursery" ? 2000 : 0, // Default glasshouse costs for nursery
        minFallowPeriod: 10, // 10 weeks minimum fallow period
      }))
    }
  }, [
    formData.shortRotationType,
    formData.vegetableType,
    formData.nurseryType,
    formData.yield,
    formData.price,
    formData.cropType,
  ])

  // Scroll tab into view when changing tabs
  useEffect(() => {
    if (tabsListRef.current) {
      const activeTabElement = tabsListRef.current.querySelector(`[data-value="${activeTab}"]`)
      if (activeTabElement) {
        activeTabElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
      }
    }
  }, [activeTab])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    // For number inputs, handle the case where user starts typing with a leading zero
    if (type === "number") {
      // Remove leading zeros for non-decimal numbers
      const cleanedValue = value.replace(/^0+(?=\\d)/, "")
      setFormData({
        ...formData,
        [name]: cleanedValue === "" ? 0 : Number.parseFloat(cleanedValue) || 0,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData({
      ...formData,
      [name]: value[0],
    })
  }

  const handleCalculate = () => {
    const calculatedResults = calculateORC(formData)
    setResults(calculatedResults)
    setActiveTab("results")
  }

  const handleReset = () => {
    // Create a deep copy of defaultValues to ensure a complete reset
    const resetValues = JSON.parse(JSON.stringify(defaultValues))
    setFormData(resetValues)
    setResults(null)
    setActiveTab("crop-selection")
  }

  // Helper function to format number input value display
  const formatInputValue = (value: number) => {
    // Check if value is undefined or null before attempting to convert it
    if (value === undefined || value === null) {
      return ""
    }
    // Return empty string if value is 0, otherwise return the value
    return value === 0 ? "" : value.toString()
  }

  // Then, update the isBanana check to use the new structure
  const isBanana = formData.cropType === "perennial" && formData.cropCategory === "banana"
  const isPerennial = formData.cropType === "perennial"
  const isTreeVineNut = formData.cropType === "tree-vine-nut"
  // Update the isShortRotation check to use the new structure
  // Add this with the other crop type checks
  const isShortRotation = formData.cropType === "annual-short-rotation"
  // Check if the current crop is a nursery root stock or large rooted plant
  const isNurseryRootStock =
    formData.bareRootType === "nursery-root-stock" ||
    formData.bareRootType === "nursery-large-rooted-plants" ||
    (results && results.formula === "nursery-root-stock")

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList
          ref={tabsListRef}
          className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-2 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          <TabsTrigger
            value="crop-selection"
            className="px-2 py-1.5 text-sm whitespace-nowrap"
            data-value="crop-selection"
          >
            Crop Selection
          </TabsTrigger>
          <TabsTrigger value="basic" className="px-2 py-1.5 text-sm whitespace-nowrap" data-value="basic">
            Basic Information
          </TabsTrigger>
          <TabsTrigger value="advanced" className="px-2 py-1.5 text-sm whitespace-nowrap" data-value="advanced">
            Advanced Parameters
          </TabsTrigger>
          <TabsTrigger value="additional" className="px-2 py-1.5 text-sm whitespace-nowrap" data-value="additional">
            Additional Costs
          </TabsTrigger>
          <TabsTrigger
            value="results"
            disabled={!results}
            className="px-2 py-1.5 text-sm whitespace-nowrap"
            data-value="results"
          >
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="crop-selection">
          <Card>
            <CardHeader>
              <CardTitle>Crop Selection</CardTitle>
              <CardDescription>Select the type of crop for ORC calculation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cropSelect">Crop</Label>
                <Select
                  value={
                    Object.keys(cropToCropTypeMapping).find((key) => {
                      const mapping = cropToCropTypeMapping[key]
                      if (mapping.type === formData.cropType) {
                        if (mapping.type === "perennial" && mapping.category === formData.cropCategory) {
                          return true
                        } else if (mapping.type === "annual-broad-acre" && formData.grainType === key) {
                          return true
                        } else if (mapping.type === "tree-vine-nut") {
                          if (mapping.subType === formData.treeType) {
                            if (mapping.category === "fruitType" && formData.fruitType === key) return true
                            if (mapping.category === "vineType" && formData.vineType === key) return true
                            if (mapping.category === "nutType" && formData.nutType === key) return true
                            if (mapping.category === "bareRootType" && formData.bareRootType === key) return true
                          }
                        } else if (mapping.type === "annual-short-rotation") {
                          if (mapping.subType === formData.shortRotationType) {
                            if (mapping.subType === "vegetables" && formData.vegetableType === key) return true
                            if (mapping.subType === "strawberries") return true
                            if (mapping.subType === "nursery" && formData.nurseryType === key) return true
                          }
                        }
                      }
                      return false
                    }) || "banana"
                  }
                  onValueChange={(value) => handleCropSelect(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="alfalfa">Alfalfa</SelectItem>
                    <SelectItem value="almonds">Almond</SelectItem>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="apricot">Apricot</SelectItem>
                    <SelectItem value="arugula">Arugula</SelectItem>
                    <SelectItem value="avocado">Avocado</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="barley">Barley</SelectItem>
                    <SelectItem value="beets">Beet</SelectItem>
                    <SelectItem value="bell-peppers">Bell Pepper</SelectItem>
                    <SelectItem value="canola">Canola</SelectItem>
                    <SelectItem value="carrots">Carrot</SelectItem>
                    <SelectItem value="cherry">Cherry</SelectItem>
                    <SelectItem value="chickpeas">Chickpea</SelectItem>
                    <SelectItem value="cotton">Cotton</SelectItem>
                    <SelectItem value="cucumbers">Cucumber</SelectItem>
                    <SelectItem value="ducasse">Ducasse</SelectItem>
                    <SelectItem value="eggplants">Eggplant</SelectItem>
                    <SelectItem value="faba-beans">Faba Bean</SelectItem>
                    <SelectItem value="field-peas">Field Pea</SelectItem>
                    <SelectItem value="foliage-plants">Foliage Plant</SelectItem>
                    <SelectItem value="garlic">Garlic</SelectItem>
                    <SelectItem value="grapefruit">Grapefruit</SelectItem>
                    <SelectItem value="grapes">Grape</SelectItem>
                    <SelectItem value="green-beans">Green Bean</SelectItem>
                    <SelectItem value="hazelnuts">Hazelnut</SelectItem>
                    <SelectItem value="kale">Kale</SelectItem>
                    <SelectItem value="kiwifruit">Kiwifruit</SelectItem>
                    <SelectItem value="large-plants">Large Plant</SelectItem>
                    <SelectItem value="leeks">Leek</SelectItem>
                    <SelectItem value="lemon">Lemon</SelectItem>
                    <SelectItem value="lentils">Lentil</SelectItem>
                    <SelectItem value="lettuce">Lettuce</SelectItem>
                    <SelectItem value="lime">Lime</SelectItem>
                    <SelectItem value="linseed">Linseed</SelectItem>
                    <SelectItem value="macadamias">Macadamia</SelectItem>
                    <SelectItem value="maize">Maize</SelectItem>
                    <SelectItem value="mandarin">Mandarin</SelectItem>
                    <SelectItem value="mango">Mango</SelectItem>
                    <SelectItem value="melons">Melon</SelectItem>
                    <SelectItem value="millet">Millet</SelectItem>
                    <SelectItem value="mother-stock">Mother Stock</SelectItem>
                    <SelectItem value="mung-beans">Mung Bean</SelectItem>
                    <SelectItem value="nectarine">Nectarine</SelectItem>
                    <SelectItem value="nursery-large-rooted-plants">Nursery Large Rooted Plants</SelectItem>
                    <SelectItem value="nursery-root-stock">Nursery Root Stock</SelectItem>
                    <SelectItem value="nursery-stock">Nursery Stock</SelectItem>
                    <SelectItem value="oats">Oat</SelectItem>
                    <SelectItem value="onions">Onion</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="papaya">Papaya</SelectItem>
                    <SelectItem value="passionfruit">Passionfruit</SelectItem>
                    <SelectItem value="peach">Peach</SelectItem>
                    <SelectItem value="pear">Pear</SelectItem>
                    <SelectItem value="pecans">Pecan</SelectItem>
                    <SelectItem value="pistachios">Pistachio</SelectItem>
                    <SelectItem value="plug-stock">Plug Stock</SelectItem>
                    <SelectItem value="plum">Plum</SelectItem>
                    <SelectItem value="potted-color">Potted Color</SelectItem>
                    <SelectItem value="pumpkins">Pumpkin</SelectItem>
                    <SelectItem value="quince">Quince</SelectItem>
                    <SelectItem value="radishes">Radish</SelectItem>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="rye">Rye</SelectItem>
                    <SelectItem value="safflower">Safflower</SelectItem>
                    <SelectItem value="seedlings">Seedling</SelectItem>
                    <SelectItem value="snap-peas">Snap Pea</SelectItem>
                    <SelectItem value="sorghum">Sorghum</SelectItem>
                    <SelectItem value="soybeans">Soybean</SelectItem>
                    <SelectItem value="spinach">Spinach</SelectItem>
                    <SelectItem value="strawberries">Strawberry</SelectItem>
                    <SelectItem value="sugar-beet">Sugar Beet</SelectItem>
                    <SelectItem value="sugar-cane">Sugar Cane</SelectItem>
                    <SelectItem value="sunflower">Sunflower</SelectItem>
                    <SelectItem value="tomatoes">Tomato</SelectItem>
                    <SelectItem value="trees-shrubs">Tree and Shrub</SelectItem>
                    <SelectItem value="turnips">Turnip</SelectItem>
                    <SelectItem value="walnuts">Walnut</SelectItem>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="zucchini">Zucchini</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cropType">Crop Type</Label>
                <Select value={formData.cropType} disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop type">
                      {formData.bareRootType === "nursery-root-stock" ||
                      formData.bareRootType === "nursery-large-rooted-plants"
                        ? "Nursery Root Stock Production and Nursery Large Rooted Plants"
                        : formData.cropType === "perennial"
                          ? "Broad Acre Perennial Crops"
                          : formData.cropType === "annual-broad-acre"
                            ? "Annual Broad Acre Crops"
                            : formData.cropType === "tree-vine-nut"
                              ? "Perennial Trees/Vine Crops/Nut Crops/Nursery Bare Root Stock Production/Large Bare Rooted Plants"
                              : "Annual Short Rotation Crops"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="perennial">Broad Acre Perennial Crops</SelectItem>
                    <SelectItem value="annual-broad-acre">Annual Broad Acre Crops</SelectItem>
                    <SelectItem value="tree-vine-nut">
                      Perennial Trees/Vine Crops/Nut Crops/Nursery Bare Root Stock Production/Large Bare Rooted Plants
                    </SelectItem>
                    <SelectItem value="annual-short-rotation">Annual Short Rotation Crops</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Crop type is automatically set based on your crop selection.</p>
              </div>

              <div className="bg-[#1a1e5a]/10 p-4 rounded-lg">
                <h3 className="font-medium text-[#1a1e5a] mb-2">ORC Formula</h3>
                {/* Display the special formula for nursery root stock and large rooted plants */}
                {isNurseryRootStock ? (
                  <>
                    <p className="text-sm">ORC = A + B + C + D</p>
                    <p className="text-sm mt-2">Where:</p>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>
                        <strong>A</strong>: Market value or estimated market value of the plants at the time of their
                        destruction.
                      </li>
                      <li>
                        <strong>B</strong>: Direct costs associated with the Response Plan incurred by the Owner but not
                        normally incurred as a production expense. This includes tree destruction costs.
                      </li>
                      <li>
                        <strong>C</strong>: Replacement value of any capital items destroyed as part of the Response
                        Plan.
                      </li>
                      <li>
                        <strong>D</strong>: Any stocks on hand which are destroyed due to the Response Plan.
                      </li>
                    </ul>
                  </>
                ) : formData.cropType === "annual-short-rotation" ? (
                  <>
                    <p className="text-sm">ORC = (A - B) + C + D + E - F + G</p>
                    <p className="text-sm mt-2">Where:</p>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>
                        <strong>A</strong>: Estimated farm gate value of the Crop(s) destroyed
                      </li>
                      <li>
                        <strong>B</strong>: Harvesting costs plus other costs normally associated with Crop production
                      </li>
                      <li>
                        <strong>C</strong>: Direct costs associated with the Response Plan
                      </li>
                      <li>
                        <strong>D</strong>: Replacement value of capital items destroyed
                      </li>
                      <li>
                        <strong>E</strong>: Loss of profits from fallow land or empty glasshouses (only if fallow
                        exceeds 10 weeks)
                      </li>
                      <li>
                        <strong>F</strong>: Profits from alternative enterprise
                      </li>
                      <li>
                        <strong>G</strong>: Value of stored produce destroyed
                      </li>
                    </ul>
                  </>
                ) : // Keep the existing formulas for other crop types
                formData.cropType === "tree-vine-nut" ? (
                  <>
                    <p className="text-sm">ORC = (A - B) + C + D + E + F + G + H + I</p>
                    <p className="text-sm mt-2">Where:</p>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>
                        <strong>A</strong>: Loss of profit from the current Crop destroyed
                      </li>
                      <li>
                        <strong>B</strong>: Harvesting costs based on 'best practice' plus other costs
                      </li>
                      <li>
                        <strong>C</strong>: Direct costs associated with the Response Plan
                      </li>
                      <li>
                        <strong>D</strong>: Replacement value of capital items destroyed
                      </li>
                      <li>
                        <strong>E</strong>: Loss of net profits for any fallow period
                      </li>
                      <li>
                        <strong>F</strong>: Tree destruction costs 'depreciated'
                      </li>
                      <li>
                        <strong>G</strong>: 'Depreciated' tree replanting costs
                      </li>
                      <li>
                        <strong>H</strong>: 'Depreciated' loss of profit during non-bearing period
                      </li>
                      <li>
                        <strong>I</strong>: Value of stored produce destroyed
                      </li>
                    </ul>
                  </>
                ) : formData.cropType === "perennial" ? (
                  <>
                    <p className="text-sm">ORC = (A - H) + B + C + D + E + F + G</p>
                    <p className="text-sm mt-2">Where:</p>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>
                        <strong>A</strong>: Value of the Crop destroyed
                      </li>
                      <li>
                        <strong>H</strong>: 'Best practice' harvesting costs plus other costs
                      </li>
                      <li>
                        <strong>B</strong>: Costs of Crop destruction (depreciated)
                      </li>
                      <li>
                        <strong>C</strong>: Other costs incurred due to Response Plan
                      </li>
                      <li>
                        <strong>D</strong>: 'Depreciated' Crop replanting costs
                      </li>
                      <li>
                        <strong>E</strong>: Loss of net profit from compulsory fallow
                      </li>
                      <li>
                        <strong>F</strong>: Replacement value of capital items destroyed
                      </li>
                      <li>
                        <strong>G</strong>: Value of stored produce destroyed
                      </li>
                    </ul>
                  </>
                ) : (
                  <>
                    <p className="text-sm">ORC = (A - B) + C + D + E - F + G</p>
                    <p className="text-sm mt-2">Where:</p>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>
                        <strong>A</strong>: Estimated farm gate value of the Crop(s) destroyed
                      </li>
                      <li>
                        <strong>B</strong>: 'Best practice' harvesting costs plus other costs
                      </li>
                      <li>
                        <strong>C</strong>: Direct costs associated with the Response Plan
                      </li>
                      <li>
                        <strong>D</strong>: Replacement value of capital items destroyed
                      </li>
                      <li>
                        <strong>E</strong>: Loss of profits from fallow land in subsequent years
                      </li>
                      <li>
                        <strong>F</strong>: Profits from alternative enterprise
                      </li>
                      <li>
                        <strong>G</strong>: Value of stored produce destroyed
                      </li>
                    </ul>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button
                onClick={() => {
                  setActiveTab("basic")
                }}
                className="bg-[#1a1e5a] hover:bg-[#2d3270]"
              >
                Next: Basic Information
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Crop Information</CardTitle>
              <CardDescription>Enter basic information about the affected crop</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isBanana && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="cropVariety">Banana Variety</Label>
                      <Select
                        value={formData.cropVariety}
                        onValueChange={(value) => handleSelectChange("cropVariety", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select variety" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cavendish">Cavendish</SelectItem>
                          <SelectItem value="lady-finger">Lady Finger</SelectItem>
                          <SelectItem value="ducasse">Ducasse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="region">Growing Region</Label>
                      <Select value={formData.region} onValueChange={(value) => handleSelectChange("region", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wet-tropics">Wet Tropics</SelectItem>
                          <SelectItem value="dry-tropics">Dry Tropics</SelectItem>
                          <SelectItem value="sub-tropics">Sub-Tropics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cropArea">Area of Crop Destroyed (hectares)</Label>
                    <MobileTooltip
                      title="Area of Crop Destroyed"
                      content={
                        <>
                          <p>
                            The total area of crop that was destroyed as part of the Response Plan, measured in
                            hectares.
                          </p>
                          <p className="mt-2">
                            This is used to calculate component A in the ORC formula: A = a × y × p, where &apos;a&apos;
                            is the area.
                          </p>
                        </>
                      }
                    />
                  </div>
                  <Input
                    id="cropArea"
                    name="cropArea"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formatInputValue(formData.cropArea)}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>

                {(isBanana || isTreeVineNut) && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cropAge">Crop Age (years)</Label>
                      <MobileTooltip
                        title="Crop Age"
                        content={
                          <p>
                            {isTreeVineNut
                              ? "The age of the orchard/vineyard at the time of destruction. This affects depreciation calculations."
                              : "The age of the crop at the time of destruction. This affects yield calculations."}
                          </p>
                        }
                      />
                    </div>
                    <Input
                      id="cropAge"
                      name="cropAge"
                      type="number"
                      min="0"
                      step="0.5"
                      value={formatInputValue(formData.cropAge)}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                )}

                {isTreeVineNut && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="rotationPeriod">Rotation Period (years)</Label>
                      <MobileTooltip
                        title="Rotation Period"
                        content={
                          <p>
                            The standardized period of rotation for the tree/vine crop in question. This is used for
                            depreciation calculations.
                          </p>
                        }
                      />
                    </div>
                    <Input
                      id="rotationPeriod"
                      name="rotationPeriod"
                      type="number"
                      min="0"
                      step="1"
                      value={formatInputValue(formData.rotationPeriod)}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="yield">Expected Yield (tonnes/hectare)</Label>
                    <MobileTooltip
                      title="Expected Yield"
                      content={
                        <>
                          <p>
                            {isTreeVineNut
                              ? "The expected yield based on owner's past records, taking into account any biennial bearing patterns."
                              : "The expected yield of the crop if it had not been destroyed."}
                            {isPerennial &&
                              !isTreeVineNut &&
                              " Yield depends on the type of crop destroyed (plant or ratoon crop)."}
                          </p>
                          {isTreeVineNut ? (
                            <p className="mt-2">
                              If the owner has no records, the regional average for that crop is to be used.
                            </p>
                          ) : isPerennial ? (
                            <p className="mt-2">
                              For perennial crops like bananas and sugar cane, yield is based on distinct average yields
                              for the type of crop destroyed. Yield refers to the marketable yield only.
                            </p>
                          ) : (
                            <p className="mt-2">
                              For annual broad acre crops, the yield is taken as the regional average for the five years
                              to year t-1.
                            </p>
                          )}
                        </>
                      }
                    />
                  </div>
                  <Input
                    id="yield"
                    name="yield"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formatInputValue(formData.yield)}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="price">
                      {isTreeVineNut
                        ? "Market Price at Farm Gate"
                        : isBanana
                          ? "Market Price"
                          : "Estimated Farm Gate Price"}{" "}
                      ($/tonne)
                    </Label>
                    <MobileTooltip
                      title={
                        isTreeVineNut
                          ? "Market Price at Farm Gate"
                          : isPerennial
                            ? "Market Price"
                            : "Estimated Farm Gate Price"
                      }
                      content={
                        isTreeVineNut ? (
                          <>
                            <p>The market price at farm gate at harvest time.</p>
                            <p className="mt-2">
                              This is used to calculate component A in the ORC formula: A = a × y × p, where
                              &apos;p&apos; is the price.
                            </p>
                          </>
                        ) : isPerennial ? (
                          <>
                            <p>The average regional market price over the previous 12 months valued at farm gate.</p>
                            <p className="mt-2">
                              If there is a contract in place, this will be used for crops applicable under the
                              contract. Otherwise, the prevailing market price will be used.
                            </p>
                          </>
                        ) : (
                          <>
                            <p>
                              The estimated farm gate price (local silo cash price less transport costs between farm
                              gate and silo) at the time of harvest.
                            </p>
                            <p className="mt-2">
                              Specifically, the average price for the two calendar months over which the bulk of
                              regional harvest takes place.
                            </p>
                          </>
                        )
                      }
                    />
                  </div>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formatInputValue(formData.price)}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>

                {!isBanana && !isTreeVineNut && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hasForwardContract">Forward Contract</Label>
                      <MobileTooltip
                        title="Forward Contract"
                        content={
                          <>
                            <p>
                              In the event that an Owner has taken out a forward contract to deliver grain at a specific
                              price, assessment of price is to be based on this contract price rather than the cash silo
                              price.
                            </p>
                            <p className="mt-2">
                              If you have a forward contract, select "Yes" and enter the contract price in the field
                              below.
                            </p>
                          </>
                        }
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hasForwardContract"
                        checked={formData.hasForwardContract}
                        onCheckedChange={(checked) => handleSwitchChange("hasForwardContract", checked)}
                      />
                      <Label htmlFor="hasForwardContract">Has Forward Contract</Label>
                    </div>
                  </div>
                )}

                {formData.hasForwardContract && !isBanana && !isTreeVineNut && (
                  <div className="space-y-2">
                    <Label htmlFor="forwardContractPrice">Forward Contract Price ($/tonne)</Label>
                    <Input
                      id="forwardContractPrice"
                      name="forwardContractPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formatInputValue(formData.forwardContractPrice)}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                )}

                {isBanana && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="isPlantCrop">Plant or Ratoon Crop</Label>
                      <MobileTooltip
                        title="Plant or Ratoon Crop"
                        content={
                          <p>
                            Plant crop is the first harvest after planting. Ratoon crops are subsequent harvests from
                            the same plant.
                          </p>
                        }
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isPlantCrop"
                        checked={formData.isPlantCrop}
                        onCheckedChange={(checked) => handleSwitchChange("isPlantCrop", checked)}
                      />
                      <Label htmlFor="isPlantCrop">{formData.isPlantCrop ? "Plant Crop" : "Ratoon Crop"}</Label>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="harvestingCosts">Harvesting Costs ($/hectare)</Label>
                    <MobileTooltip
                      title="Harvesting Costs"
                      content={
                        <p>
                          {isTreeVineNut
                            ? "Harvesting costs based on 'best practice' as estimated by State/Territory departments of agriculture."
                            : "Best practice harvesting costs that would have been incurred if the crop was not destroyed."}
                        </p>
                      }
                    />
                  </div>
                  <Input
                    id="harvestingCosts"
                    name="harvestingCosts"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formatInputValue(formData.harvestingCosts)}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>
              </div>

              {isTreeVineNut && !isNurseryRootStock && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="nonBearingPeriod">Non-Bearing Period (years)</Label>
                        <MobileTooltip
                          title="Non-Bearing Period"
                          content={
                            <>
                              <p>
                                The period during which immature trees/vines do not produce a commercial crop. This is
                                used to calculate the 'depreciated' loss of profit during the non-bearing period.
                              </p>
                              <p className="mt-2">
                                This corresponds to component H in the ORC formula: H = 'Depreciated' loss of profit
                                during the non-bearing period of immature trees.
                              </p>
                            </>
                          }
                        />
                      </div>
                      <Input
                        id="nonBearingPeriod"
                        name="nonBearingPeriod"
                        type="number"
                        min="0"
                        step="1"
                        value={formatInputValue(formData.nonBearingPeriod)}
                        onChange={handleInputChange}
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="immatureLoss">Loss During Non-Bearing Period ($/hectare/year)</Label>
                        <MobileTooltip
                          title="Loss During Non-Bearing Period"
                          content={
                            <p>
                              The estimated loss of profit during the non-bearing period of immature trees. If not
                              specified, the gross margin will be used.
                            </p>
                          }
                        />
                      </div>
                      <Input
                        id="immatureLoss"
                        name="immatureLoss"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formatInputValue(formData.immatureLoss)}
                        onChange={handleInputChange}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Add the unit type selection for short rotation crops in the basic information tab */}
              {/* Add this in the basic information tab section */}
              {formData.cropType === "annual-short-rotation" && (
                <div className="space-y-2">
                  <Label htmlFor="unitType">Unit Type</Label>
                  <Select value={formData.unitType} onValueChange={(value) => handleSelectChange("unitType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight">Weight (tonnes/hectare)</SelectItem>
                      <SelectItem value="count">Count (units/hectare)</SelectItem>
                    </SelectContent>
                    <p className="text-xs text-gray-500">
                      Select "Weight" for crops measured in tonnes, or "Count" for crops measured in units (e.g.,
                      seedlings).
                    </p>
                  </Select>
                </div>
              )}

              {/* Add the unit count field for count-based crops */}
              {formData.cropType === "annual-short-rotation" && formData.unitType === "count" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="unitCount">Expected Units (count/hectare)</Label>
                    <MobileTooltip
                      title="Expected Units"
                      content={
                        <p>
                          The expected number of units (e.g., seedlings, plants) per hectare that would have been sold
                          if the crop had not been destroyed.
                        </p>
                      }
                    />
                  </div>
                  <Input
                    id="unitCount"
                    name="unitCount"
                    type="number"
                    min="0"
                    step="1"
                    value={formatInputValue(formData.unitCount)}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleTabChange("crop-selection")}>
                Back
              </Button>
              <Button
                onClick={() => {
                  setActiveTab("advanced")
                }}
                className="bg-[#1a1e5a] hover:bg-[#2d3270]"
              >
                Next: Advanced Parameters
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Parameters</CardTitle>
              <CardDescription>Configure additional parameters for more accurate ORC calculation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(isBanana || (isTreeVineNut && !isNurseryRootStock)) && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="destructionCosts">
                        {isTreeVineNut ? "Tree/Vine Destruction Costs" : "Crop Destruction Costs"} ($/hectare)
                      </Label>
                      <MobileTooltip
                        title={isTreeVineNut ? "Tree/Vine Destruction Costs" : "Crop Destruction Costs"}
                        content={
                          <>
                            <p>Costs incurred by the owner for destroying the crop as directed by the Response Plan.</p>
                            <p className="mt-2">
                              These costs are determined with reference to the lowest of 3 reasonable quotes from local
                              suppliers for any external inputs/services required and reasonable estimates of
                              internal/operational costs incurred.
                            </p>
                            <p className="mt-2">
                              {isTreeVineNut
                                ? "This corresponds to component F in the ORC formula and is depreciated based on orchard/vineyard age."
                                : "This corresponds to component B in the ORC formula and is depreciated based on crop age."}
                            </p>
                            {isTreeVineNut && (
                              <p className="mt-2">
                                Depreciation is based on a straight line method between full cost reimbursement at the
                                beginning of commercial production of the rotation and the end of the rotation.
                              </p>
                            )}
                          </>
                        }
                      />
                    </div>
                    <Input
                      id="destructionCosts"
                      name="destructionCosts"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formatInputValue(formData.destructionCosts)}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                )}

                {(isBanana || (isTreeVineNut && !isNurseryRootStock)) && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="replantingCosts">
                        {isTreeVineNut ? "Tree/Vine Replanting Costs" : "Replanting Costs"} ($/hectare)
                      </Label>
                      <MobileTooltip
                        title={isTreeVineNut ? "Tree/Vine Replanting Costs" : "Replanting Costs"}
                        content={
                          <>
                            <p>
                              {isTreeVineNut
                                ? "Costs for replanting trees/vines after the Response Plan allows. These costs are depreciated using the same method as for tree destruction costs."
                                : "Costs for replanting the crop after the Response Plan allows. Default is $15,125/hectare."}
                            </p>
                            {isTreeVineNut && (
                              <p className="mt-2">
                                This corresponds to component G in the ORC formula: G = 'Depreciated' tree replanting
                                costs as for tree destruction costs.
                              </p>
                            )}
                          </>
                        }
                      />
                    </div>
                    <Input
                      id="replantingCosts"
                      name="replantingCosts"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formatInputValue(formData.replantingCosts)}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                )}

                {!isNurseryRootStock && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="productionCosts">Production Costs ($/hectare)</Label>
                      <MobileTooltip
                        title="Production Costs"
                        content={
                          <p>
                            {isTreeVineNut
                              ? "Other costs (such as watering or pruning costs) normally associated with crop production between the time of tree destruction and harvest."
                              : "Normal production costs that would have been incurred between crop destruction and harvest."}
                          </p>
                        }
                      />
                    </div>
                    <Input
                      id="productionCosts"
                      name="productionCosts"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formatInputValue(formData.productionCosts)}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                )}

                {!isNurseryRootStock && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="grossMargin">Gross Margin ($/hectare)</Label>
                      <MobileTooltip
                        title="Gross Margin"
                        content={
                          <p>
                            {isTreeVineNut
                              ? "Net profit standardized based on regional gross margins calculations for the crop in question by State/Territory departments of agriculture."
                              : "Regional gross margin estimates for calculating loss of net profit from compulsory fallow."}
                          </p>
                        }
                      />
                    </div>
                    <Input
                      id="grossMargin"
                      name="grossMargin"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formatInputValue(formData.grossMargin)}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                )}
              </div>

              {!isNurseryRootStock && (
                <>
                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="fallowPeriod">Compulsory Fallow Period (years)</Label>
                      <MobileTooltip
                        title="Compulsory Fallow Period"
                        content={
                          <>
                            <p>The period during which the land must remain fallow as part of the Response Plan.</p>
                            <p className="mt-2">
                              Owner Reimbursement Costs are restricted to loss of profits for a maximum of three years.
                            </p>
                            {!isPerennial && (
                              <p className="mt-2">
                                Methods of estimating loss of profits are the same as for the year in which the Crop is
                                destroyed and include deductions for ground preparation and planting costs normally
                                associated with Crop production.
                              </p>
                            )}
                          </>
                        }
                      />
                      <span className="text-sm text-gray-500">{formData.fallowPeriod} years</span>
                    </div>
                    <Slider
                      id="fallowPeriod"
                      min={0}
                      max={3}
                      step={0.5}
                      value={[formData.fallowPeriod]}
                      onValueChange={(value) => handleSliderChange("fallowPeriod", value)}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500">
                      Maximum allowable fallow period is 3 years under the EPPRD framework.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="normalFallowPeriod">Normal Fallow Period (years)</Label>
                      <MobileTooltip
                        title="Normal Fallow Period"
                        content={<p>The normal fallow period that would occur in your standard crop rotation cycle.</p>}
                      />
                    </div>
                    <Input
                      id="normalFallowPeriod"
                      name="normalFallowPeriod"
                      type="number"
                      min="0"
                      step="0.1"
                      value={formatInputValue(formData.normalFallowPeriod)}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                </>
              )}

              {/* Add the additional fields for short rotation crops in the advanced parameters tab */}
              {/* Add this in the advanced parameters tab section */}
              {formData.cropType === "annual-short-rotation" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="packagingCosts">Packaging Costs ($/hectare)</Label>
                        <MobileTooltip
                          title="Packaging Costs"
                          content={
                            <p>
                              Costs associated with packaging the crop for sale, including materials and labor. These
                              are considered part of component B in the ORC formula.
                            </p>
                          }
                        />
                      </div>
                      <Input
                        id="packagingCosts"
                        name="packagingCosts"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formatInputValue(formData.packagingCosts)}
                        onChange={handleInputChange}
                        placeholder="0"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="treatmentCosts">Treatment Costs ($/hectare)</Label>
                        <MobileTooltip
                          title="Treatment Costs"
                          content={
                            <p>
                              Costs for washing, dipping, or other treatments normally applied to the crop before sale.
                              These are considered part of component B in the ORC formula.
                            </p>
                          }
                        />
                      </div>
                      <Input
                        id="treatmentCosts"
                        name="treatmentCosts"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formatInputValue(formData.treatmentCosts)}
                        onChange={handleInputChange}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {(formData.shortRotationType === "nursery" ||
                    formData.vegetableType === "tomatoes" ||
                    formData.vegetableType === "cucumbers") && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="glassHouseCosts">Glasshouse Cleaning Costs ($/hectare)</Label>
                        <MobileTooltip
                          title="Glasshouse Cleaning Costs"
                          content={
                            <p>
                              Costs associated with cleaning glasshouses or protected cropping structures as part of the
                              Response Plan. These are considered part of component C in the ORC formula.
                            </p>
                          }
                        />
                      </div>
                      <Input
                        id="glassHouseCosts"
                        name="glassHouseCosts"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formatInputValue(formData.glassHouseCosts)}
                        onChange={handleInputChange}
                        placeholder="0"
                      />
                    </div>
                  )}

                  <div className="bg-[#e6eeff] p-4 rounded-lg border border-[#1a1e5a]">
                    <h3 className="font-medium text-[#1a1e5a] mb-2">Fallow Period Information</h3>
                    <p className="text-sm text-gray-700">
                      For Annual Short Rotation Crops, ORC for fallow periods are only available where the Response Plan
                      requires a fallow period that exceeds ten weeks.
                    </p>
                    <p className="text-sm text-gray-700 mt-2">
                      When setting the Compulsory Fallow Period above, please enter the total fallow period in years.
                      The calculator will automatically account for the 10-week minimum threshold in the calculations.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleTabChange("basic")}>
                Back
              </Button>
              <Button
                onClick={() => {
                  setActiveTab("additional")
                }}
                className="bg-[#1a1e5a] hover:bg-[#2d3270]"
              >
                Next: Additional Costs
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="additional">
          <Card>
            <CardHeader>
              <CardTitle>Additional Costs</CardTitle>
              <CardDescription>Enter any additional costs incurred as a result of the Response Plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="additionalCosts">Direct Costs of Response Plan ($/hectare)</Label>
                    <MobileTooltip
                      title="Direct Costs of Response Plan"
                      content={
                        <>
                          <p>
                            Direct costs associated with the Response Plan incurred by the Owner but not normally
                            incurred as a production expense.
                          </p>
                          {isNurseryRootStock ? (
                            <p className="mt-2">
                              This corresponds to component B in the ORC formula: ORC = A + B + C + D
                            </p>
                          ) : (
                            <p className="mt-2">
                              These correspond to component C in the ORC formula: ORC = (A - B) + C + D + E + F + G + H
                              + I
                            </p>
                          )}
                        </>
                      }
                    />
                  </div>
                  <Input
                    id="additionalCosts"
                    name="additionalCosts"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formatInputValue(formData.additionalCosts)}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="capitalItemsValue">Replacement Value of Capital Items Destroyed ($)</Label>
                    <MobileTooltip
                      title="Replacement Value of Capital Items Destroyed"
                      content={
                        <p>
                          Replacement value of any capital items destroyed as part of the Response Plan, such as
                          irrigation equipment or fencing.
                          {isNurseryRootStock && " This corresponds to component C in the ORC formula."}
                        </p>
                      }
                    />
                  </div>
                  <Input
                    id="capitalItemsValue"
                    name="capitalItemsValue"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formatInputValue(formData.capitalItemsValue)}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="storedProduceAmount">Amount of Stored Produce Destroyed (tonnes)</Label>
                    <MobileTooltip
                      title="Amount of Stored Produce Destroyed"
                      content={
                        <>
                          <p>
                            Amount of any stored produce on farm destroyed as a directive of the Response Plan including
                            seed or nuts.
                          </p>
                          {isNurseryRootStock ? (
                            <p className="mt-2">
                              This corresponds to component D in the ORC formula: Any stocks on hand which are destroyed
                              due to the Response Plan.
                            </p>
                          ) : (
                            <p className="mt-2">
                              This corresponds to component I in the ORC formula and is valued at market price at farm
                              gate.
                            </p>
                          )}
                        </>
                      }
                    />
                  </div>
                  <Input
                    id="storedProduceAmount"
                    name="storedProduceAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formatInputValue(formData.storedProduceAmount)}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="storedProducePrice">Price of Stored Produce ($/tonne)</Label>
                    <MobileTooltip
                      title="Price of Stored Produce"
                      content={<p>Price per tonne of any stored produce destroyed as part of the Response Plan.</p>}
                    />
                  </div>
                  <Input
                    id="storedProducePrice"
                    name="storedProducePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formatInputValue(formData.storedProducePrice)}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>

                {!isPerennial && !isNurseryRootStock && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="alternativeEnterpriseProfit">
                        Profits from Alternative Enterprise ($/hectare)
                      </Label>
                      <MobileTooltip
                        title="Profits from Alternative Enterprise"
                        content={
                          <>
                            <p>
                              Profits from any alternative enterprise undertaken on the land during the compulsory
                              fallow period.
                            </p>
                            <p className="mt-2">
                              If there is an opportunity following the Response Plan for modernising or upgrading the
                              orchard — for example, closer tree plantings, more expensive varieties, or trellis
                              plantings, the level of Owner Reimbursement Costs is to be related strictly to replacing
                              the asset that was there.
                            </p>
                          </>
                        }
                      />
                    </div>
                    <Input
                      id="alternativeEnterpriseProfit"
                      name="alternativeEnterpriseProfit"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formatInputValue(formData.alternativeEnterpriseProfit)}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                )}
              </div>
            </CardContent>
            {/* Update the CardFooter in the "additional" tab */}
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleTabChange("advanced")}>
                Back
              </Button>
              <Button onClick={handleCalculate} className="bg-[#1a1e5a] hover:bg-[#2d3270] text-white">
                Calculate ORC <Calculator className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle className="text-black">ORC Calculation Results</CardTitle>
              <CardDescription>
                Summary of the calculated Owner Reimbursement Costs (ORC) based on the provided information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {results ? (
                <>
                  <ORCSummary results={results} formData={formData} onRestart={handleReset} />
                  <Accordion type="single" collapsible>
                    <AccordionItem value="breakdown">
                      <AccordionTrigger>Detailed Breakdown of ORC Components</AccordionTrigger>
                      <AccordionContent>
                        <ORCBreakdown formData={formData} results={results} />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </>
              ) : (
                <p>No results to display. Please calculate ORC first.</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleTabChange("additional")}>
                Back
              </Button>
              <Button variant="secondary" onClick={handleReset}>
                Start New Calculation
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
