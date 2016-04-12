setwd ("/Users/katerabinowitz/Documents/CodeforDC/school-modernization/InputData")
dcFullUpdated<-read.csv("DCSchools_FY1415_Master_4_6_21CSFUPDATE.csv",stringsAsFactors=FALSE, strip.white=TRUE)

dcFullUpdated<-subset(dcFullUpdated,dcFullUpdated$School!="")
str(dcFullUpdated)

money<-function(x) {
  x<-(sub("\\$","",x))
}

percent<-function(x) {
  x<-(sub("\\&","",x))
}

tab<-function(x) {
  x<-(sub("\t","",x))
}

numeric<- function(x) {
  x<-as.numeric(gsub(",","",x))
}

write.csv(dcFullUpdated,
          "/Users/katerabinowitz/Documents/CodeforDC/school-modernization/Output Data/DCSchools_FY1415_Master_412.csv",
          row.names=FALSE)

dcFullUpdated$MajorExp9815<-tab(dcFullUpdated$MajorExp9815)
dcFullUpdated$MajorExp9815<-money(dcFullUpdated$MajorExp9815)
dcFullUpdated$MajorExp9815<-numeric(dcFullUpdated$MajorExp9815)

dcFullUpdated$LifetimeBudget<-tab(dcFullUpdated$LifetimeBudget)
dcFullUpdated$LifetimeBudget<-money(dcFullUpdated$LifetimeBudget)
dcFullUpdated$LifetimeBudget<-numeric(dcFullUpdated$LifetimeBudget)

dcFullUpdated$TotalAllotandPlan1621<-tab(dcFullUpdated$TotalAllotandPlan1621)
dcFullUpdated$TotalAllotandPlan1621<-money(dcFullUpdated$TotalAllotandPlan1621)
dcFullUpdated$TotalAllotandPlan1621<-numeric(dcFullUpdated$TotalAllotandPlan1621)

dcFullUpdated$SpentPerMaxOccupancy<-money(dcFullUpdated$SpentPerMaxOccupancy)
dcFullUpdated$SpentPerMaxOccupancy<-numeric(dcFullUpdated$SpentPerMaxOccupancy)

dcFullUpdated$SpentPerSqFt<-money(dcFullUpdated$SpentPerSqFt)
dcFullUpdated$SpentPerSqFt<-numeric(dcFullUpdated$SpentPerSqFt)

dcFullUpdated$totalSQFT<-numeric(dcFullUpdated$totalSQFT)
dcFullUpdated$SqFtPerEnroll<-numeric(dcFullUpdated$SqFtPerEnroll)

colnames(dcFullUpdated)[c(35)]<-"latitude"

setwd ("/Users/katerabinowitz/Documents/CodeforDC/school-modernization/Output Data")
newMulti<-read.csv("DCPS_MultiSchool_Project_Spend.csv",stringsAsFactors=FALSE, strip.white=TRUE)[c(1,2)]

newMulti$Sum.of.Lifetime.Budget<-money(newMulti$Sum.of.Lifetime.Budget)
newMulti$Sum.of.Lifetime.Budget<-numeric(newMulti$Sum.of.Lifetime.Budget)

write.csv(newMulti,
          "/Users/katerabinowitz/Documents/CodeforDC/school-modernization/Output Data/DCPS_MultiSchool_Project_Spend.csv.csv",
          row.names=FALSE)
