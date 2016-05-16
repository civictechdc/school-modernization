library(reshape)
library(plyr)
library(jsonlite)
schoolMod<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/Output%20Data/DCSchools_FY1415_Master_412.csv",
                    stringsAsFactors=FALSE, strip.white=TRUE)
str(flippedSchoolModWard)
colnames(schoolMod)
schoolModSum<-schoolMod[c(1,4,5,7,9,10,12,15,26:29,31,34:35)]
colnames(schoolModSum)
schoolModSpend<-schoolModSum[c(1,5,7:12,14:15)]
colnames(schoolModSpend)
flip1 <- reshape(schoolModSpend [c(1:4)], 
                 varying = c("MajorExp9815", "TotalAllotandPlan1621", "LifetimeBudget"), 
                 v.names = "totalSpend",
                 timevar = "timePeriod", 
                 times = c("past","future","lifetime"), 
                 direction = "long")
flip2 <- reshape(schoolModSpend[c(1,5,8,10)], 
                 varying = c("SpentPerMaxOccupancy", "TotalAllotandPlan1621perMaxOcc", "LifetimeBudgetperMaxOcc"), 
                 v.names = "spendPerMaxOcc",
                 timevar = "timePeriod", 
                 times = c("past","future","lifetime"), 
                 direction = "long")
flip12<-merge(flip1,flip2,by=c("School","timePeriod"))
flip3 <- reshape(schoolModSpend[c(1,6,7,9)], 
                 varying = c("SpentPerSqFt", "TotalAllotandPlan1621perGSF", "LifetimeBudgetperGSF"), 
                 v.names = "spendPerSqFt",
                 timevar = "timePeriod", 
                 times = c("past","future","lifetime"),  
                 direction = "long")
flippedSpend<-merge(flip12, flip3,by=c("School","timePeriod"))[c(1:3,5,7)]

flippedSchoolModWard<-merge(schoolModSum[c(1:4,6)],flippedSpend,by="School")
all.combs <- unlist(lapply(0:5,combn,x=c("Agency","Ward","Level","ProjectType","timePeriod"),
                           simplify=FALSE),recursive=FALSE)
wardAllComb<-ldply(all.combs, function(y) ddply(flippedSchoolModWard,y,summarise,
                                                spendPerSqFt=mean(as.numeric(spendPerSqFt), na.rm=TRUE),
                                                spendPerMaxOcc=mean(as.numeric(spendPerMaxOcc), na.rm=TRUE),
                                                totalSpend=sum(as.numeric(totalSpend), na.rm=TRUE)))
wardAllComb$totalSpend<-round(wardAllComb$totalSpend,0)
wardAllComb$spendPerMaxOcc<-round(wardAllComb$spendPerMaxOcc,2)
wardAllComb$spendPerSqFt<-round(wardAllComb$spendPerSqFt,2)
wardAllComb<-wardAllComb[-c(1)]

flippedSchoolModFeeder<-merge(schoolModSum[c(1,2,4,6,13)],flippedSpend,by="School")
all.combsF <- unlist(lapply(0:5,combn,x=c("Agency","FeederHS","Level","ProjectType","timePeriod"),
                            simplify=FALSE),recursive=FALSE)
feedAllComb<-ldply(all.combsF, function(y) ddply(flippedSchoolModFeeder,y,summarise,
                                                 spendPerSqFt=mean(as.numeric(spendPerSqFt), na.rm=TRUE),
                                                 spendPerMaxOcc=mean(as.numeric(spendPerMaxOcc), na.rm=TRUE),
                                                 totalSpend=sum(as.numeric(totalSpend), na.rm=TRUE)))
feedAllComb$totalSpend<-round(feedAllComb$totalSpend,0)
feedAllComb$spendPerMaxOcc<-round(feedAllComb$spendPerMaxOcc,2)
feedAllComb$spendPerSqFt<-round(feedAllComb$spendPerSqFt,2)
feedAllComb<-feedAllComb[-c(1)]

feederCombinations<-toJSON(feedAllComb)
cat(feederCombinations)

wardCombinations <- toJSON(wardAllComb)
cat(wardCombinations)

library(RJSONIO)
write(feederCombinations,
      "/Users/katerabinowitz/Documents/CodeforDC/school-modernization/Output Data/FeederCombinations.json")
write(wardCombinations,
      "/Users/katerabinowitz/Documents/CodeforDC/school-modernization/Output Data/WardCombinations.json")
