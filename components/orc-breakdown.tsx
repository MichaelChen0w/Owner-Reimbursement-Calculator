"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"

export function ORCBreakdown({ results, formData }: { results: any; formData: any }) {
  // Update the ORC Breakdown to use the new crop structure

  // Determine which formula to use based on the results
  const isBanana = formData.cropType === "perennial" && formData.cropCategory === "banana"
  const isPerennial = formData.cropType === "perennial"
  const isTreeVineNut = formData.cropType === "tree-vine-nut"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Breakdown</CardTitle>
        <CardDescription>Detailed breakdown of each component in the ORC calculation</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="formula" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="formula">Formula</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            {(isBanana || (isTreeVineNut && results.formula !== "nursery-root-stock")) && (
              <TabsTrigger value="depreciation">Depreciation</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="formula">
            <div className="space-y-4">
              <div className="bg-[#1a1e5a]/10 p-4 rounded-lg">
                <h3 className="font-medium text-[#1a1e5a] mb-2">ORC Formula</h3>
                {results.formula === "nursery-root-stock" ? (
                  <>
                    <p className="text-sm">ORC = A + B + C + D</p>
                    <p className="text-sm mt-2">Where:</p>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>
                        <strong>A</strong>: Market value or estimated market value of the plants at the time of their
                        destruction
                      </li>
                      <li>
                        <strong>B</strong>: Direct costs associated with the Response Plan incurred by the Owner but not
                        normally incurred as a production expense. This includes tree destruction costs.
                      </li>
                      <li>
                        <strong>C</strong>: Replacement value of any capital items destroyed as part of the Response
                        Plan
                      </li>
                      <li>
                        <strong>D</strong>: Any stocks on hand which are destroyed due to the Response Plan
                      </li>
                    </ul>
                  </>
                ) : isTreeVineNut ? (
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
                ) : isBanana ? (
                  <>
                    <p className="text-sm">ORC = (A - H) + B + C + D + E + F + G</p>
                    <p className="text-sm mt-2">Where:</p>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>
                        <strong>A</strong>: Value of the Crop destroyed = a × y × p
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
                ) : results.formula === "annual-short-rotation" ? (
                  <>
                    <p className="text-sm">ORC = (A - B) + C + D + E - F + G</p>
                    <p className="text-sm mt-2">Where:</p>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>
                        <strong>A</strong>: Estimated farm gate value of the Crop(s) destroyed
                      </li>
                      <li>
                        <strong>B</strong>: Harvesting, packaging, treatment, and other production costs
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
                ) : (
                  <>
                    <p className="text-sm">ORC = (A - B) + C + D + E - F + G</p>
                    <p className="text-sm mt-2">Where:</p>
                    <ul className="text-sm mt-1 space-y-1">
                      <li>
                        <strong>A</strong>: Estimated farm gate value of the Crop(s) destroyed = a × y × p
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

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Calculation</h3>
                <div className="space-y-2 text-sm">
                  {results.formula === "nursery-root-stock" ? (
                    <>
                      <p>
                        ORC = {formatCurrency(results.valueOfCrop)} + {formatCurrency(results.additionalCosts)} +{" "}
                        {formatCurrency(results.capitalItemsValue)} + {formatCurrency(results.storedProduceValue)}
                      </p>
                      <p>
                        ORC ={" "}
                        {formatCurrency(
                          results.valueOfCrop +
                            results.additionalCosts +
                            results.capitalItemsValue +
                            results.storedProduceValue,
                        )}
                      </p>
                    </>
                  ) : isTreeVineNut ? (
                    <>
                      <p>
                        ORC = ({formatCurrency(results.valueOfCrop)} - {formatCurrency(results.harvestingCosts)}) +{" "}
                        {formatCurrency(results.additionalCosts)} + {formatCurrency(results.capitalItemsValue)} +{" "}
                        {formatCurrency(results.fallowLoss)} + {formatCurrency(results.destructionCosts)} +{" "}
                        {formatCurrency(results.replantingCosts)} + {formatCurrency(results.immatureLossTotal)} +{" "}
                        {formatCurrency(results.storedProduceValue)}
                      </p>
                      <p>
                        ORC = {formatCurrency(results.valueOfCrop - results.harvestingCosts)} +{" "}
                        {formatCurrency(
                          results.additionalCosts +
                            results.capitalItemsValue +
                            results.fallowLoss +
                            results.destructionCosts +
                            results.replantingCosts +
                            results.immatureLossTotal +
                            results.storedProduceValue,
                        )}
                      </p>
                    </>
                  ) : isBanana ? (
                    <>
                      <p>
                        ORC = ({formatCurrency(results.valueOfCrop)} - {formatCurrency(results.harvestingCosts)}) +{" "}
                        {formatCurrency(results.destructionCosts)} + {formatCurrency(results.additionalCosts)} +{" "}
                        {formatCurrency(results.replantingCosts)} + {formatCurrency(results.fallowLoss)} +{" "}
                        {formatCurrency(results.capitalItemsValue)} + {formatCurrency(results.storedProduceValue)}
                      </p>
                      <p>
                        ORC = {formatCurrency(results.valueOfCrop - results.harvestingCosts)} +{" "}
                        {formatCurrency(
                          results.destructionCosts +
                            results.additionalCosts +
                            results.replantingCosts +
                            results.fallowLoss +
                            results.capitalItemsValue +
                            results.storedProduceValue,
                        )}
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        ORC = ({formatCurrency(results.valueOfCrop)} - {formatCurrency(results.harvestingCosts)}) +{" "}
                        {formatCurrency(results.additionalCosts)} + {formatCurrency(results.capitalItemsValue)} +{" "}
                        {formatCurrency(results.fallowLoss)} - {formatCurrency(results.alternativeProfit)} +{" "}
                        {formatCurrency(results.storedProduceValue)}
                      </p>
                      <p>
                        ORC = {formatCurrency(results.valueOfCrop - results.harvestingCosts)} +{" "}
                        {formatCurrency(
                          results.additionalCosts +
                            results.capitalItemsValue +
                            results.fallowLoss -
                            results.alternativeProfit +
                            results.storedProduceValue,
                        )}
                      </p>
                    </>
                  )}
                  <p>ORC = {formatCurrency(results.totalORC)}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="components">
            <div className="space-y-4">
              {results.formula === "nursery-root-stock" ? (
                <>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">A: Market Value of Plants</h3>
                    <p className="text-sm">Area: {formData.cropArea} hectares</p>
                    <p className="text-sm">Yield: {formData.yield} tonnes/hectare</p>
                    <p className="text-sm">Price: {formatCurrency(formData.price)}/tonne</p>
                    <p className="text-sm mt-2">
                      A = {formData.cropArea} × {formData.yield} × {formatCurrency(formData.price)} ={" "}
                      {formatCurrency(results.valueOfCrop)}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">B: Direct Costs of Response Plan</h3>
                    <p className="text-sm">Additional costs: {formatCurrency(formData.additionalCosts)}/hectare</p>
                    <p className="text-sm">Destruction costs: {formatCurrency(formData.destructionCosts)}/hectare</p>
                    <p className="text-sm mt-2">
                      Total for {formData.cropArea} hectares: {formatCurrency(results.additionalCosts)}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">C: Capital Items Value</h3>
                    <p className="text-sm">Capital items destroyed: {formatCurrency(formData.capitalItemsValue)}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">D: Stored Produce Value</h3>
                    <p className="text-sm">Amount: {formData.storedProduceAmount} tonnes</p>
                    <p className="text-sm">Price: {formatCurrency(formData.storedProducePrice)}/tonne</p>
                    <p className="text-sm mt-2">Total value: {formatCurrency(results.storedProduceValue)}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">
                      A:{" "}
                      {isBanana ? "Value of the Crop destroyed" : "Estimated farm gate value of the Crop(s) destroyed"}
                    </h3>
                    {results.formula === "annual-short-rotation" && formData.unitType === "count" ? (
                      <>
                        <p className="text-sm">A = a × u × p</p>
                        <ul className="text-sm mt-2 space-y-1">
                          <li>a (Area): {formData.cropArea} hectares</li>
                          <li>u (Units): {formData.unitCount} units/hectare</li>
                          <li>p (Price): {formatCurrency(formData.price)}/unit</li>
                        </ul>
                        <p className="text-sm mt-2">
                          A = {formData.cropArea} × {formData.unitCount} × {formatCurrency(formData.price)} ={" "}
                          {formatCurrency(results.valueOfCrop)}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm">A = a × y × p</p>
                        <ul className="text-sm mt-2 space-y-1">
                          <li>a (Area): {formData.cropArea} hectares</li>
                          <li>y (Yield): {formData.yield} tonnes/hectare</li>
                          <li>
                            p ({isBanana ? "Price" : "Estimated farm gate price"}):{" "}
                            {formatCurrency(
                              formData.hasForwardContract ? formData.forwardContractPrice : formData.price,
                            )}
                            /tonne
                          </li>
                          {formData.hasForwardContract && <li>(Using forward contract price)</li>}
                        </ul>
                        <p className="text-sm mt-2">
                          A = {formData.cropArea} × {formData.yield} ×{" "}
                          {formatCurrency(formData.hasForwardContract ? formData.forwardContractPrice : formData.price)}{" "}
                          = {formatCurrency(results.valueOfCrop)}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">{isBanana ? "H" : "B"}: Harvesting & Production Costs</h3>
                      <p className="text-sm">Harvesting costs: {formatCurrency(formData.harvestingCosts)}/hectare</p>
                      <p className="text-sm">Production costs: {formatCurrency(formData.productionCosts)}/hectare</p>
                      {results.formula === "annual-short-rotation" && (
                        <>
                          <p className="text-sm">Packaging costs: {formatCurrency(formData.packagingCosts)}/hectare</p>
                          <p className="text-sm">Treatment costs: {formatCurrency(formData.treatmentCosts)}/hectare</p>
                        </>
                      )}
                      <p className="text-sm mt-2">
                        Total for {formData.cropArea} hectares: {formatCurrency(results.harvestingCosts)}
                      </p>
                    </div>

                    {isBanana ? (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">B: Crop Destruction Costs</h3>
                        <p className="text-sm">
                          Destruction costs: {formatCurrency(formData.destructionCosts)}/hectare
                        </p>
                        <p className="text-sm mt-2">Depreciated value: {formatCurrency(results.destructionCosts)}</p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">C: Direct costs associated with Response Plan</h3>
                        <p className="text-sm">Additional costs: {formatCurrency(formData.additionalCosts)}/hectare</p>
                        {results.formula === "annual-short-rotation" && formData.glassHouseCosts > 0 && (
                          <p className="text-sm">
                            Glasshouse cleaning costs: {formatCurrency(formData.glassHouseCosts)}/hectare
                          </p>
                        )}
                        <p className="text-sm mt-2">
                          Total for {formData.cropArea} hectares: {formatCurrency(results.additionalCosts)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isBanana ? (
                      <>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">C: Additional Response Plan Costs</h3>
                          <p className="text-sm">
                            Additional costs: {formatCurrency(formData.additionalCosts)}/hectare
                          </p>
                          <p className="text-sm mt-2">
                            Total for {formData.cropArea} hectares: {formatCurrency(results.additionalCosts)}
                          </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">D: Replanting Costs</h3>
                          <p className="text-sm">
                            Replanting costs: {formatCurrency(formData.replantingCosts)}/hectare
                          </p>
                          <p className="text-sm mt-2">Depreciated value: {formatCurrency(results.replantingCosts)}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">D: Capital Items Value</h3>
                          <p className="text-sm">
                            Capital items destroyed: {formatCurrency(formData.capitalItemsValue)}
                          </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">E: Loss from Compulsory Fallow</h3>
                          <p className="text-sm">Gross margin: {formatCurrency(formData.grossMargin)}/hectare</p>
                          <p className="text-sm">Fallow period: {formData.fallowPeriod} years</p>
                          <p className="text-sm">Normal fallow: {formData.normalFallowPeriod} years</p>
                          <p className="text-sm mt-2">Total loss: {formatCurrency(results.fallowLoss)}</p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {isBanana ? (
                      <>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">E: Loss from Compulsory Fallow</h3>
                          <p className="text-sm">Gross margin: {formatCurrency(formData.grossMargin)}/hectare</p>
                          <p className="text-sm">Fallow period: {formData.fallowPeriod} years</p>
                          <p className="text-sm">Normal fallow: {formData.normalFallowPeriod} years</p>
                          <p className="text-sm mt-2">Total loss: {formatCurrency(results.fallowLoss)}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">F: Capital Items Value</h3>
                          <p className="text-sm">
                            Capital items destroyed: {formatCurrency(formData.capitalItemsValue)}
                          </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">G: Stored Produce Value</h3>
                          <p className="text-sm">Amount: {formData.storedProduceAmount} tonnes</p>
                          <p className="text-sm">Price: {formatCurrency(formData.storedProducePrice)}/tonne</p>
                          <p className="text-sm mt-2">Total value: {formatCurrency(results.storedProduceValue)}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">F: Alternative Enterprise Profit</h3>
                          <p className="text-sm">
                            Profit per hectare: {formatCurrency(formData.alternativeEnterpriseProfit)}
                          </p>
                          <p className="text-sm mt-2">Total profit: {formatCurrency(results.alternativeProfit)}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">G: Stored Produce Value</h3>
                          <p className="text-sm">Amount: {formData.storedProduceAmount} tonnes</p>
                          <p className="text-sm">Price: {formatCurrency(formData.storedProducePrice)}/tonne</p>
                          <p className="text-sm mt-2">Total value: {formatCurrency(results.storedProduceValue)}</p>
                        </div>
                      </>
                    )}
                  </div>
                  {isTreeVineNut && (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">H: 'Depreciated' loss of profit during non-bearing period</h3>
                        <p className="text-sm">Non-bearing period: {formData.nonBearingPeriod} years</p>
                        <p className="text-sm">
                          Loss per year: {formatCurrency(formData.immatureLoss || formData.grossMargin)}/hectare
                        </p>
                        <p className="text-sm">Depreciation factor: {(results.depreciationFactor * 100).toFixed(2)}%</p>
                        <p className="text-sm mt-2">Total loss: {formatCurrency(results.immatureLossTotal)}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">I: Stored Produce Value</h3>
                        <p className="text-sm">Amount: {formData.storedProduceAmount} tonnes</p>
                        <p className="text-sm">Price: {formatCurrency(formData.storedProducePrice)}/tonne</p>
                        <p className="text-sm mt-2">Total value: {formatCurrency(results.storedProduceValue)}</p>
                      </div>
                    </>
                  )}
                  {results.formula === "annual-short-rotation" && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">E: Loss from Fallow Land or Empty Glasshouses</h3>
                      <p className="text-sm">Gross margin: {formatCurrency(formData.grossMargin)}/hectare</p>
                      <p className="text-sm">Compulsory fallow period: {formData.fallowPeriod} years</p>
                      <p className="text-sm">
                        Minimum fallow threshold: {results.minFallowPeriodWeeks} weeks (
                        {(results.minFallowPeriodWeeks / 52).toFixed(2)} years)
                      </p>
                      <p className="text-sm">
                        Eligible fallow period:{" "}
                        {Math.max(0, formData.fallowPeriod - results.minFallowPeriodWeeks / 52).toFixed(2)} years
                      </p>
                      <p className="text-sm mt-2">Total loss: {formatCurrency(results.fallowLoss)}</p>
                      {results.fallowLoss === 0 && (
                        <p className="text-xs text-amber-600 mt-1">
                          Note: No fallow loss compensation is available as the fallow period does not exceed the
                          minimum threshold of {results.minFallowPeriodWeeks} weeks.
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          {(isBanana || (isTreeVineNut && results.formula !== "nursery-root-stock")) && (
            <TabsContent value="depreciation">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Depreciation Method</h3>
                  <p className="text-sm">
                    The EPPRD uses Method 2 for depreciation, which calculates the difference between the sums of two
                    discounted net profit/cost streams.
                  </p>
                  <p className="text-sm mt-2">Discount rate used: {formData.discountRate}%</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Crop Destruction Costs Depreciation</h3>
                    <p className="text-sm">
                      Original value: {formatCurrency(formData.destructionCosts * formData.cropArea)}
                    </p>
                    <p className="text-sm">Depreciated value: {formatCurrency(results.destructionCosts)}</p>
                    <p className="text-sm mt-2">
                      Depreciation factor: {(results.destructionDepreciationFactor * 100).toFixed(2)}%
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Replanting Costs Depreciation</h3>
                    <p className="text-sm">
                      Original value: {formatCurrency(formData.replantingCosts * formData.cropArea)}
                    </p>
                    <p className="text-sm">Depreciated value: {formatCurrency(results.replantingCosts)}</p>
                    <p className="text-sm mt-2">
                      Depreciation factor: {(results.replantingDepreciationFactor * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Fallow Period Calculation</h3>
                  <p className="text-sm">Compulsory fallow period: {formData.fallowPeriod} years</p>
                  <p className="text-sm">Normal fallow period: {formData.normalFallowPeriod} years</p>
                  <p className="text-sm">
                    Additional fallow: {Math.max(0, formData.fallowPeriod - formData.normalFallowPeriod)} years
                  </p>
                  <p className="text-sm mt-2">Gross margin per hectare: {formatCurrency(formData.grossMargin)}</p>
                  <p className="text-sm">Total area: {formData.cropArea} hectares</p>
                  <p className="text-sm mt-2">
                    Loss calculation: {formData.cropArea} × {formatCurrency(formData.grossMargin)} ×{" "}
                    {Math.max(0, formData.fallowPeriod - formData.normalFallowPeriod)} ={" "}
                    {formatCurrency(results.fallowLoss)}
                  </p>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
