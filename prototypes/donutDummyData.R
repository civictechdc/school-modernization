currentOut<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/Output%20Data/DC_Schools_Master_114.csv")[c(1,2,10:12)]
options(scipen=999)
currentOut$ProjectType<-ifelse(currentOut$Agency=="PCS","Annual Allotment",
                               as.character(currentOut$ProjectType))

currentOut$rownumber = 1:nrow(currentOut)

currentOut$MajorExp9815<-ifelse(currentOut$rownumber>116, runif(125, 1000, 60000),
                                currentOut$MajorExp9815)
currentOut$MajorExp9815<-as.numeric(format(round(currentOut$MajorExp9815, 2), nsmall = 2))

currentOut$TotalAllotandPlan1621<-ifelse(currentOut$rownumber>116, runif(125, 1000, 60000),
                                currentOut$TotalAllotandPlan1621)
currentOut$TotalAllotandPlan1621<-as.numeric(format(round(currentOut$TotalAllotandPlan1621, 2), nsmall = 2))
currentOut$SubProject<-rep(NA,242)

OutExpand <- currentOut[c(1,5,9,11,50,63,72,91,82,48,85,111,46,99,20,34,61), 1:7]
OutExpand$ProjectType<-ifelse(OutExpand$ProjectType=="FULL MOD + ADD","PARTIAL MOD",
                              ifelse(OutExpand$ProjectType=="STABILIZED ","FULL MOD + ADD",
                                     "PARTIAL MOD"))
OutExpand$MajorExp9815<-OutExpand$MajorExp9815/2.2
OutExpand$TotalAllotandPlan1621<-OutExpand$TotalAllotandPlan1621*1.6

SubProject<-c("Windows","Doors","Paint","Brick","Floors","Ceiling","Roof","Tech","Appliances","Classroom","Dummy1","Dummy2",
              "Dummy3","Dummy4","Dummy5","Dummy6","Dummy7","Dummy8","Dummy9","Dummy10","Dummy11","Dummy12","Dummy13",
              "Dummy14","Dummy15","Dummy16","Dummy17","Dummy18","Dummy19","Dummy20","Dummy21","Dummy22","Dummy23","Dummy24",
              "Dummy25","Dummy26","Dummy27","Dummy28","Dummy29","Dummy30","Dummy31","Dummy32","Dummy33","Dummy34","Dummy35",
              "Dummy36","Dumy37","Dummy38")
ProjectType<-rep(c("FULL MOD","FULL MOD + ADD","FULL REPLACEMENT","PARTIAL MOD","PARTIAL MOD + ADD","STABILIZED"),8)
MajorExp9815<-runif(48, 1000, 60000)
TotalAllotandPlan1621<-runif(48, 1000, 60000)
Agency<-rep("Multischool",48)
School<-rep(NA,48)

Multischool<-as.data.frame(cbind(Agency,MajorExp9815,TotalAllotandPlan1621,School, ProjectType,SubProject), 
                           stringsAsFactors=FALSE)

SingleSchool<-rbind(currentOut,OutExpand)[c(1:5,7)]

DummyData<-rbind(Multischool,SingleSchool)
write.csv(DummyData,
          "/Users/katerabinowitz/Documents/CodeforDC/school-modernization/Output Data/donutDummyData.csv",
          row.names=FALSE)
