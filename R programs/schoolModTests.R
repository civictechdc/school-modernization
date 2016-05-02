schoolMod<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/Output%20Data/DCSchools_FY1415_Master_412.csv",
                    stringsAsFactors=FALSE, strip.white=TRUE)
#Ward Summation
wardPlanSum<-aggregate(list(plan = schoolMod$TotalAllotandPlan1621), by=list(Ward=schoolMod$Ward,Agency=schoolMod$Agency), 
                       FUN=sum, na.rm=TRUE)
wardLifeSum<-aggregate(list(lifetime =schoolMod$LifetimeBudget), by=list(Ward=schoolMod$Ward,Agency=schoolMod$Agency), 
                       FUN=sum, na.rm=TRUE)
wardHistSum<-aggregate(list(past=schoolMod$MajorExp9815), by=list(Ward=schoolMod$Ward,Agency=schoolMod$Agency), 
                       FUN=sum, na.rm=TRUE)
WardSum<-cbind(wardPlanSum,wardLifeSum,wardHistSum)[c(1:3,6,9)]
rm(wardPlanSum,wardLifeSum,wardHistSum)

#District Summation
FeederHSPlanSum<-aggregate(list(plan = schoolMod$TotalAllotandPlan1621), by=list(FeederHS=schoolMod$FeederHS,Agency=schoolMod$Agency), 
                       FUN=sum, na.rm=TRUE)
FeederHSLifeSum<-aggregate(list(lifetime =schoolMod$LifetimeBudget), by=list(FeederHS=schoolMod$FeederHS,Agency=schoolMod$Agency), 
                       FUN=sum, na.rm=TRUE)
FeederHSHistSum<-aggregate(list(past=schoolMod$MajorExp9815), by=list(FeederHS=schoolMod$FeederHS,Agency=schoolMod$Agency), 
                       FUN=sum, na.rm=TRUE)
FeederSum<-cbind(FeederHSPlanSum,FeederHSLifeSum,FeederHSHistSum)[c(1:3,6,9)]
rm(FeederHSPlanSum,FeederHSLifeSum,FeederHSHistSum)

#Ward Per Student
wardPlanStudent<-aggregate(list(plan = schoolMod$TotalAllotandPlan1621perMaxOcc), by=list(Ward=schoolMod$Ward,Agency=schoolMod$Agency), 
                           FUN=mean, na.rm=TRUE)
wardLifeStudent<-aggregate(list(lifetime =schoolMod$LifetimeBudgetperMaxOcc), by=list(Ward=schoolMod$Ward,Agency=schoolMod$Agency), 
                           FUN=mean, na.rm=TRUE)
wardHistStudent<-aggregate(list(past=schoolMod$SpentPerMaxOccupancy), by=list(Ward=schoolMod$Ward,Agency=schoolMod$Agency), 
                           FUN=mean, na.rm=TRUE)
wardStudent<-cbind(wardPlanStudent, wardLifeStudent,wardHistStudent)[c(1:3,6,9)]
rm(wardPlanStudent, wardLifeStudent,wardHistStudent)

#FeederHS Per Student
FeederHSPlanStudent<-aggregate(list(plan = schoolMod$TotalAllotandPlan1621perMaxOcc), by=list(FeederHS=schoolMod$FeederHS,Agency=schoolMod$Agency), 
                           FUN=mean, na.rm=TRUE)
FeederHSLifeStudent<-aggregate(list(lifetime =schoolMod$LifetimeBudgetperMaxOcc), by=list(FeederHS=schoolMod$FeederHS,Agency=schoolMod$Agency), 
                           FUN=mean, na.rm=TRUE)
FeederHSHistStudent<-aggregate(list(past=schoolMod$SpentPerMaxOccupancy), by=list(FeederHS=schoolMod$FeederHS,Agency=schoolMod$Agency), 
                           FUN=mean, na.rm=TRUE)
FeederStudent<-cbind(FeederHSPlanStudent,FeederHSLifeStudent,FeederHSHistStudent)[c(1:3,6,9)]
rm(FeederHSPlanStudent,FeederHSLifeStudent,FeederHSHistStudent)

#Ward Per SQ
wardPlanSQ<-aggregate(list(plan = schoolMod$TotalAllotandPlan1621perGSF), by=list(Ward=schoolMod$Ward,Agency=schoolMod$Agency), 
                      FUN=mean, na.rm=TRUE)
wardLifeSQ<-aggregate(list(lifetime =schoolMod$LifetimeBudgetperGSF), by=list(Ward=schoolMod$Ward,Agency=schoolMod$Agency), 
                      FUN=mean, na.rm=TRUE)
wardHistSQ<-aggregate(list(past=schoolMod$SpentPerSqFt), by=list(Ward=schoolMod$Ward,Agency=schoolMod$Agency), 
                      FUN=mean, na.rm=TRUE)
wardSQ<-cbind(wardPlanSQ, wardLifeSQ,wardHistSQ)[c(1:3,6,9)]
rm(wardPlanSQ, wardLifeSQ,wardHistSQ)

#Feeder Per SQ
FeederHSPlanSQ<-aggregate(list(plan = schoolMod$TotalAllotandPlan1621perGSF), by=list(FeederHS=schoolMod$FeederHS,Agency=schoolMod$Agency), 
                      FUN=mean, na.rm=TRUE)
FeederHSLifeSQ<-aggregate(list(lifetime =schoolMod$LifetimeBudgetperGSF), by=list(FeederHS=schoolMod$FeederHS,Agency=schoolMod$Agency), 
                      FUN=mean, na.rm=TRUE)
FeederHSHistSQ<-aggregate(list(past=schoolMod$SpentPerSqFt), by=list(FeederHS=schoolMod$FeederHS,Agency=schoolMod$Agency), 
                      FUN=mean, na.rm=TRUE)
FeederSQ<-cbind(FeederHSPlanSQ,FeederHSLifeSQ,FeederHSHistSQ)[c(1:3,6,9)]
rm(FeederHSPlanSQ,FeederHSLifeSQ,FeederHSHistSQ)

