library(stringr)
library(plyr)
library(gtools)
library(reshape)
library(ggmap)
library(rgdal)
### read in final ### 
### read in final ### 
### read in final ### 
dcFull<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/Output%20Data/Old/DCSchoolsMaster_213_21CSF_edits.csv",
          stringsAsFactors=FALSE, strip.white=TRUE)[-c(35)]
dcFull<-subset(dcFull,dcFull$School!="")

enroll<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/2014-15%20Enrollment%20Audit.csv",
                 stringsAsFactors=FALSE, strip.white=TRUE)[c(1,4:21,25:30)]

closedCharter<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/Output%20Data/Old/PCS_MasterClosed_210.csv",
                 stringsAsFactors=FALSE, strip.white=TRUE)

charterFuture<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/FAc%20Allowance%201999-2021-Table%201.csv",
                        stringsAsFactors=FALSE, strip.white=TRUE)[c(1,3:8)]
charterFuture<-subset(charterFuture,charterFuture$Master.PCS.List.1998.2014.15!="")
### Functions ###
money<-function(x) {
  x<-(sub("\\$","",x))
}
numeric<- function(x) {
  x<-as.numeric(gsub(",","",x))
}


### Add in Future Spending for Charters ###
### Add in Future Spending for Charters ###
### Add in Future Spending for Charters ###
charterFuture$FY16<-numeric(charterFuture$FY2016.FA)
charterFuture$FY17<-numeric(charterFuture$FY2017.FA)
charterFuture$FY18<-numeric(charterFuture$FY2018.FA)
charterFuture$FY19<-numeric(charterFuture$FY2019.FA)
charterFuture$FY20<-numeric(charterFuture$FY2020.FA)
charterFuture$FY21<-numeric(charterFuture$FY2021.FA)
charterFuture$TotalAllotandPlan1621<-charterFuture$FY21 + charterFuture$FY20 + charterFuture$FY19 +
  charterFuture$FY18 + charterFuture$FY17 + charterFuture$FY16

OpenFuture<-subset(charterFuture,charterFuture$TotalAllotandPlan1621!=0)
OpenFuture$SchoolName<-gsub("  "," ",OpenFuture$Master.PCS.List.1998.2014.15)
OpenFuture$SchoolName<-ifelse(OpenFuture$SchoolName=="AppleTree Douglass/Savannah Terr.","AppleTree Southeast",
                        ifelse(OpenFuture$SchoolName=="Capital City Upper School","Capital City High School",
                          ifelse(OpenFuture$SchoolName=="Cesar Chavez Bruce Prep","Cesar Chavez PCS Chavez Prep",
                            ifelse(OpenFuture$SchoolName=="DCI, District of Columbia International School","District of Columbia International School",
                             ifelse(OpenFuture$SchoolName=="E.L. Haynes Kansas Ave Elementary","E.L. Haynes PCS Kansas Avenue (Elementary School)",
                               ifelse(OpenFuture$SchoolName=="E.W. Stokes","Elsie Whitlow Stokes Community Freedom PCS",
                                 ifelse(OpenFuture$SchoolName=="Friendship Collegiate","Friendship Woodson Collegiate Academy",
                                   ifelse(OpenFuture$SchoolName=="Next Step","The Next Step",OpenFuture$SchoolName ))))))))


OpenFuture<-OpenFuture[order(OpenFuture$SchoolName),]
OpenFuture<-OpenFuture[c(14:15)]

charterFull<-subset(dcFull, dcFull$Agency=="PCS")[c(2)]
charter<-unique(charterFull)
charter$School<-gsub("  "," ",charter$School)
charter<-charter[order(charter$School),]

futureBind<-cbind(OpenFuture,charter)[c(1,3)]
colnames(futureBind)[c(2)]<-c("School")

charterJoin<-subset(dcFull, dcFull$Agency=="PCS")[-c(11)]
charterFull<-join(charterJoin,futureBind,by="School")

DCPS<-subset(dcFull, dcFull$Agency !="PCS")
dcFull<-rbind(DCPS,charterFull)

### update lat long and calculated fields to account for updated fields ###
### update lat long and calculated fields to account for updated fields ###
### update lat long and calculated fields to account for updated fields ###
dcFull$MajorExp9815<-money(dcFull$MajorExp9815)
dcFull$MajorExp9815<-numeric(dcFull$MajorExp9815)
dcFull$totalSQFT<-numeric(dcFull$totalSQFT)
attach(dcFull)

dcFull$AtRiskPer<-At_Risk/Total.Enrolled
dcFull$SpentPerMaxOccupancy<-ifelse(Agency=="DCPS",MajorExp9815/maxOccupancy,MajorExp9815/Total.Enrolled)
dcFull$SpentPerSqFt<-MajorExp9815/totalSQFT

dcFull$AnnualExpenseAverage<-MajorExp9815/YearsOpen
dcFull$AnnualSpentPerMaxOccupany<-ifelse(Agency=="DCPS",dcFull$AnnualExpenseAverage/maxOccupancy,
                                         dcFull$AnnualExpenseAverage/Total.Enrolled)

dcFull$AnnualSpentPerSqFt<-dcFull$AnnualExpenseAverage/totalSQFT

###add back in school code
attach(dcFull)
schoolCode<-enroll[c(2:3)]
dcFull$School.Name<-dcFull$School
join01<-join(schoolCode,dcFull,by="School.Name", type="inner")
join01<-subset(join01,!(is.na(join01$School.ID)))
missDC<-subset(dcFull,!(dcFull$School.Name %in% join01$School.Name))
missDC$School.Name<-ifelse(missDC$School.Name=="School-Within-School at Goding",
                           "School Within School at Goding",
                           ifelse(missDC$School.Name=="Bunker Hill ES","Brookland EC at Bunker Hill",
                                  missDC$School.Name))

missDC1<-subset(missDC,(!(is.na(missDC$Total.Enrolled))) & missDC$Address!="2801 Calvert St NW"
                | missDC$School=="Incarcerated Youth Program")

missDC2<-subset(missDC,(is.na(missDC$Total.Enrolled)) | missDC$Address=="2801 Calvert St NW"
                & missDC$School!="Incarcerated Youth Program")

missEnroll<-subset(schoolCode, !(schoolCode$School.Name %in% join01$School.Name))
missEnroll<-subset(missEnroll,missEnroll$School.ID!="160")

missDC1<-missDC1[order(missDC1$School.Name),]
missEnroll<-missEnroll[order(missEnroll$School.Name),]
miss<-cbind(missEnroll, missDC1)[-c(37)]

missDC2$School.ID<-ifelse(missDC2$School.Name=="Oyster-Adams Bilingual School",292,NA)

dcCodes<-rbind(join01,miss,missDC2)[-c(16:18)]

### Geocode for address fixes
noAddress<-subset(dcCodes,is.na(dcCodes$Address))
yesAddress<-subset(dcCodes,!(is.na(dcCodes$Address)))
yesAddress$FullAddress<-paste(yesAddress$Address, ",Washington,DC")
address<-yesAddress$FullAddress
latlong<-geocode(address, source="google")

ward = readOGR("http://opendata.dc.gov/datasets/a4442c906559456eb6ef3ea0898fe994_32.geojson", "OGRGeoJSON")
addAll<-SpatialPoints(latlong, proj4string=CRS(as.character("+proj=longlat +datum=WGS84 +no_defs +ellps=WGS84 +towgs84=0,0,0")))
wardID <- over(addAll, ward )
ward<-wardID[c(4)]

noAddress$longitude<-rep(NA,20)
noAddress$latitude<-rep(NA,20)
noAddress$Ward<-rep(NA,20)

dcFull1<-cbind(yesAddress,latlong,ward)[-c(34)]
colnames(dcFull1)[c(34:36)]<-c("longitude","latitude","Ward")

dcFullNew<-rbind(dcFull1,noAddress)[-c(2)]

### Refine unqBuilding indicator to include distinction between shared school and share building
dupAddress<-dcFullNew[duplicated(dcFullNew[,4]),]
dupAddress<-dupAddress[order(dupAddress$Address),]
dupAddress<-subset(dupAddress,!(is.na(dupAddress$Address)))
allDup<-subset(dcFullNew, dcFullNew$Address %in% dupAddress$Address)
noDup<-subset(dcFullNew,!(dcFullNew$Address %in% dupAddress$Address))

allDup$unqBuilding<-rep(2,36)
dcFullUpdated<-rbind(noDup,allDup)

### Add in missing LEP
updateLEP<-subset(dcFullUpdated,is.na(dcFullUpdated$Limited.English.Proficient) & !(is.na(dcFullUpdated$Total.Enrolled)))
updateLEP<-subset(updateLEP,updateLEP$School.ID!=292)[-c(18,20)]
enroll_LEP_miss<-enroll[c(2,20:24)]
fixedLEP<-join(updateLEP,enroll_LEP_miss,by="School.ID", type="left")
fixedLEP$SPED<-fixedLEP$Level.1+fixedLEP$Level.2+fixedLEP$Level.3+fixedLEP$Level.4
fixedLEP<-fixedLEP[-c(35:38)]
goodstartLEP<-subset(dcFullUpdated,!(dcFullUpdated$School.ID %in% fixedLEP$School.ID))
dcFullUpdated<-rbind(goodstartLEP,fixedLEP)

### Clean up school names
dcFullUpdated$School1<-gsub("PCS","",dcFullUpdated$School)
dcFullUpdated$School1<-gsub("EC","Education Campus",dcFullUpdated$School1)
dcFullUpdated$School1<-gsub("ES","Elementary",dcFullUpdated$School1)
dcFullUpdated$School1<-gsub("MS","Middle",dcFullUpdated$School1)
dcFullUpdated$School1<-gsub("HS","High",dcFullUpdated$School1)
dcFullUpdated$School1<-gsub("  "," ",dcFullUpdated$School1)
dcFullUpdated$School1<-gsub("D C ","DC ",dcFullUpdated$School1)
dcFullUpdated$School1<-gsub(" -|- ","-",dcFullUpdated$School1)
dcFullUpdated$School1<-ifelse(dcFullUpdated$School1=="Community Academy CA Online","Community Academy CAPCS Online",
                      ifelse(dcFullUpdated$School1=="Community Academy CA Online","Community Academy CAPCS Online",
                        ifelse(dcFullUpdated$School1=="Columbia Heights Education Campus (CHEducation Campus)","Columbia Heights Education Campus (CHEC)",
                          ifelse(dcFullUpdated$School1=="bowen","Bowen",
                            ifelse(dcFullUpdated$School1=="brucemonroe-demolished","Bruce Monroe (demolished)",
                              ifelse(dcFullUpdated$School1=="ferebeehope","Ferebee Hope",
                                ifelse(dcFullUpdated$School1=="garnettpatterson","Garnett Patterson",
                                  ifelse(dcFullUpdated$School1=="macfarland","Macfarland",
                                    ifelse(dcFullUpdated$School1=="Malcolmx","Malcolm X",
                                      ifelse(dcFullUpdated$School1=="marshall","Marshall",
                                        ifelse(dcFullUpdated$School1=="mcterrell","Mcterrell",
                                          ifelse(dcFullUpdated$School1=="mmwashingtion","MM Washington",
                                            ifelse(dcFullUpdated$School1=="montgomery/kipp","Montgomery/Kipp",
                                              ifelse(dcFullUpdated$School1=="prharris","PR Harris",
                                                ifelse(dcFullUpdated$School1=="rhterrell","RH Terrell",
                                                  ifelse(dcFullUpdated$School1=="ronbrown","Ron Brown",
                                                    ifelse(dcFullUpdated$School1=="rudolph","Rudolph",
                                                      ifelse(dcFullUpdated$School1=="shaw","Shaw",
                                                        ifelse(dcFullUpdated$School1=="wilkinson","Wilkinson",
                                                               dcFullUpdated$School1)))))))))))))))))))
dcFullUpdated<-dcFullUpdated[-c(3)]
colnames(dcFullUpdated)[c(35)]<-c("School")


### Remove dots in colnames
colnames(dcFullUpdated)[c(1,16,17,28)]<-c("School_ID","Total_Enrolled","Limited_English","Open_Now")

### All schools except closed charters
write.csv(dcFullUpdated,
          "/Users/katerabinowitz/Documents/CodeforDC/school-modernization/Output Data/DC_Schools_Master_214.csv",
          row.names=FALSE)

### All open schools (excluding Incarcerated Youth, Dorothy Haight, CHOICE at Emery and Youth Services Center)
### for mapping
dcFullOpen<-subset(dcFullUpdated,dcFullUpdated$Open_Now==1)
write.csv(dcFullOpen,
          "/Users/katerabinowitz/Documents/CodeforDC/school-modernization/Output Data/DC_OpenSchools_Master_214.csv",
          row.names=FALSE)

### All schools - open and closed - for bubble
bubble<-dcFullUpdated[c(2,4,7,10:15,20,24,25,28,29:31,34,35)]

dupSpend<-bubble[duplicated(bubble[,5]),]
dupSpend<-subset(dupSpend,!(is.na(dupSpend$MajorExp9815)) & dupSpend$MajorExp9815!=0  )
allDup<-subset(bubble, bubble$MajorExp9815 %in% dupSpend$MajorExp9815)
allDup<-allDup[order(allDup$MajorExp9815),]

Single<-allDup[!(duplicated(allDup[,2])),]
bubbleNoDup<-subset(bubble,!(bubble$School %in% Single$School))
bubbleXCC<-rbind(bubbleNoDup,Single)
bubbleXCC<-bubbleXCC[-c(7)]

closedCharter<-closedCharter[c(1,2,6,7)]
colnames(closedCharter)[c(1)]<-"School"
closedCharter$Agency<-rep("PCS",81)

blanks<-function(x) {
  x<-rep(NA,81)
}
closedCharter$maxOccupancy<-blanks(closedCharter$maxOccupancy)
closedCharter$Level<-blanks(closedCharter$Level)
closedCharter$TotalAllotandPlan1621<-blanks(closedCharter$TotalAllotandPlan1621)
closedCharter$LifetimeBudget<-blanks(closedCharter$LifetimeBudget)
closedCharter$FeederMS<-blanks(closedCharter$FeederMS)
closedCharter$FeederHS<-blanks(closedCharter$FeederHS)
closedCharter$AtRiskPer<-blanks(closedCharter$AtRiskPer)
closedCharter$SpentPerMaxOccupancy<-blanks(closedCharter$SpentPerMaxOccupancy)
closedCharter$SpentPerSqFt<-blanks(closedCharter$SpentPerSqFt)
closedCharter$AnnualExpenseAverage<-blanks(closedCharter$AnnualExpenseAverage)
closedCharter$AnnualSpentPerMaxOccupany<-blanks(closedCharter$AnnualSpentPerMaxOccupany)
closedCharter$AnnualSpentPerSqFt<-blanks(closedCharter$AnnualSpentPerSqFt)
closedCharter$Ward<-blanks(closedCharter$Ward)

colnames(closedCharter)[c(3)]<-"Open_Now"

bubbleFinal<-rbind(bubbleXCC,closedCharter)

write.csv(bubbleFinal,
          "/Users/katerabinowitz/Documents/CodeforDC/school-modernization/Output Data/DC_Bubbles_Master_214.csv",
          row.names=FALSE)
