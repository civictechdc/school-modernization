library(stringr)
library(plyr)
library(rgdal)
library(gtools)
### Read in data ###
### Read in data ###
### Read in data ###
spend<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/Base%20spending%20data%20and%20GSF%2021CSF.csv",
                stringsAsFactors=FALSE, strip.white=TRUE)[c(1:2,4,6,57,66,68)]
colnames(spend)<-c("School.Short","School", "totalSQFT","MajorProject.Yr","MajorExp9815","TotalAllotandPlan1621","LifetimeBudget")

spend<-subset(spend,spend$School!="")
#spend<-subset(spend,!(grepl("Closed",spend$X) | grepl("Omitted",spend$X) | grepl ("demolished",spend$X)
#                      | grepl ("closed",spend$X) | grepl("#1",spend$X)))
spend$School<-tolower(spend$School)

enroll<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/2014-15%20Enrollment%20Audit.csv",
                 stringsAsFactors=FALSE, strip.white=TRUE)[c(1,4:21,25:30)]
enroll$SchoolCode<-enroll$School.ID

appC.Charter<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/Charter%20capacities-Table%201.csv",
                       stringsAsFactors=FALSE, strip.white=TRUE)[c(1:7,10)]
colnames(appC.Charter)<-c("LEA.Code","SchoolGroupCode","School","Address","formerDCPS","maxOccupancy","totalSQFT","EnrollCeiling")
appC.Charter<-subset(appC.Charter,appC.Charter$SchoolGroupCode!="")

appC.DCPS<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/DCPS%20Building%20Condition%20Dat%20(2-Table%201.csv",
                    stringsAsFactors=FALSE, strip.white=TRUE, skip=1)[c(2,4,6:8,10,12)]
colnames(appC.DCPS)<-c("Agency","Name","Program","School","Address","maxOccupancy","Enroll.Cap")
appC.DCPS<-subset(appC.DCPS,appC.DCPS$Program!="" & appC.DCPS$Name!="")

budgetDCPS<-read.csv("https://raw.githubusercontent.com/codefordc/dcps-budget/master/app/data/data.csv",
                     stringsAsFactors=FALSE, strip.white=TRUE)[c(1:6,8,10)]
budgetDCPSunq<-budgetDCPS[!duplicated(budgetDCPS[,1:2]),]

CharterLoc<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/schools.csv",
                     stringsAsFactors=FALSE, strip.white=TRUE)[c(2:5,8,12:14)]
### Create DCPS dataset ###
appC.DCPS$SCHOOLCODE<-ifelse(appC.DCPS$Program=="452/462", "452",
                            ifelse(appC.DCPS$Program=="459/456", "459",
                              ifelse(appC.DCPS$Program=="201","292",
                                ifelse(appC.DCPS$Program=="360", "629",
                                  ifelse(appC.DCPS$Program=="433","415",
                                    ifelse(appC.DCPS$Program=="175","943",
                                           appC.DCPS$Program))))))
DCPSfactors<-join(appC.DCPS, budgetDCPSunq, by="SCHOOLCODE",type="left")
DCPS<-DCPSfactors[c("Agency","Name","School","Address","maxOccupancy","Enroll.Cap","SCHOOLCODE","LON","LAT","WARD")]
colnames(DCPS)<-c("Agency","School","School.Short","Address","maxOccupancy","Enroll.Cap",
                  "SchoolCode","Longitude","Latitude", "Ward")
DCPS$School<-tolower(DCPS$School)
DCPS.Spend<-join(DCPS, spend, by="School",type="inner")
#[c(1:3,5:12,15:17)]

#going to hold on merging the remaining spend and DCPS until I can get a printout of the mismatches to look at
mismatchDCPS<-subset(DCPS,!(DCPS$School %in% DCPS.Spend$School))
mismatchSpend<-subset(spend,!(spend$School %in% DCPS.Spend$School))

###Create Charter dataset###
CharterLoc$SchoolGroupCode<-ifelse(CharterLoc$school_code==182 | CharterLoc$school_code==184 |
                                     CharterLoc$school_code==1207, "1207,184 & 182",
                              ifelse(CharterLoc$school_code==102 | CharterLoc$school_code==109,
                                          "102 & 109",
                                ifelse(CharterLoc$school_code==1110 | CharterLoc$school_code==218,
                                                 "1110 & 218",
                                 ifelse(CharterLoc$school_code==1206 | CharterLoc$school_code==1138,
                                                        "1206 & 1138",
                                  ifelse(CharterLoc$school_code==1211 | CharterLoc$school_code==1113,
                                                               "1211 & 1113",
                                    ifelse(CharterLoc$school_code==362 | CharterLoc$school_code==361,
                                                                      "362 & 361",
                                      ifelse(CharterLoc$school_code==363 | CharterLoc$school_code==364,
                                                                             "363 & 364",
                                        ifelse(CharterLoc$school_code==365 | CharterLoc$school_code==366,
                                                                                    "365 & 366",
                                          ifelse(CharterLoc$school_code==236 | CharterLoc$school_code==237,
                                                                                           "236 & 237",
                                            ifelse(CharterLoc$school_code==209 | CharterLoc$school_code==242 |
                                                             CharterLoc$school_code==214, "209, 242 & 214",
                                              ifelse(CharterLoc$school_code==1129 | CharterLoc$school_code==190
                                                              | CharterLoc$school_code==121, "1129, 190 & 121",
                                                ifelse(CharterLoc$school_code==189 | CharterLoc$school_code==132 |
                                                                  CharterLoc$school_code==1121,"189, 132 & 1121",
                                                  ifelse(CharterLoc$school_code==116 | CharterLoc$school_code==1122 |
                                                                      CharterLoc$school_code==3071, "116, 1122 &3071",
                                                    ifelse(CharterLoc$school_code==222 | CharterLoc$school_code==170,
                                                                       "222 & 170",
                                                      ifelse(CharterLoc$school_code==1118 | CharterLoc$school_code==125,
                                                                        "1118 & 125",
                                                         ifelse(CharterLoc$school_code==101 | CharterLoc$school_code==137,
                                                                       "101 & 137", CharterLoc$school_code))))))))))))))))

CharterLoc<-CharterLoc[!duplicated(CharterLoc[,9]),]
Charters<-join(appC.Charter,CharterLoc,by="SchoolGroupCode",type="left")
Charters$Ward<-gsub("Ward ","",Charters$ward)
Charters$Feeder<-rep(NA,92)
Charters$Level<-rep(NA,92)
Charters$TotalExp9815<-rep(NA,92)
Charters$TotalAllot1621<-rep(NA,92)
Charters$LifetimeBudget<-rep(NA,92)
Charters$Agency<-rep("PCS",92)
Charters<-Charters[c(2:4,6:7,14:15,17:23)]
colnames(Charters)[c(1,5:7)]<-c("SchoolCode","totalSQFT","Latitude","Longitude")

### DC Schools ###
### DC Schools ###
### DC Schools ###
DCschools<-rbind(Charters,DCPS.Spend)

DCSchool.Enroll<-join(DCschools,enroll,by="SchoolCode",type="inner")
nomatch<-subset(DCschools,!(DCschools$SchoolCode %in% DCSchool.Enroll$SchoolCode))
enrollnm<-subset(enroll,!(enroll$SchoolCode %in% DCSchool.Enroll$SchoolCode) & enroll$Sector=="Charters")

# appC.Charter is by building and CharterPop is by school. In some buildings there are multiple 'schools' 
# within a single building so here I merge buildings and aggregate that school data up to building
enrollnm$Building<-ifelse(enrollnm$SchoolCode==182 | enrollnm$SchoolCode==184 |
                            enrollnm$SchoolCode==1207, "1207,184 & 182",
                      ifelse(enrollnm$SchoolCode==102 | enrollnm$SchoolCode==109,
                            "102 & 109",
                        ifelse(enrollnm$SchoolCode==1110 | enrollnm$SchoolCode==218,
                            "1110 & 218",
                          ifelse(enrollnm$SchoolCode==1206 | enrollnm$SchoolCode==1138,
                             "1206 & 1138",
                            ifelse(enrollnm$SchoolCode==1211 | enrollnm$SchoolCode==1113,
                                "1211 & 1113",
                              ifelse(enrollnm$SchoolCode==362 | enrollnm$SchoolCode==361,
                                 "362 & 361",
                                ifelse(enrollnm$SchoolCode==363 | enrollnm$SchoolCode==364,
                                     "363 & 364",
                                 ifelse(enrollnm$SchoolCode==365 | enrollnm$SchoolCode==366,
                                    "365 & 366",
                                   ifelse(enrollnm$SchoolCode==236 | enrollnm$SchoolCode==237,
                                     "236 & 237",
                                     ifelse(enrollnm$SchoolCode==209 | enrollnm$SchoolCode==242 |
                                       enrollnm$SchoolCode==214, "209, 242 & 214",
                                       ifelse(enrollnm$SchoolCode==1129 | enrollnm$SchoolCode==190
                                         | enrollnm$SchoolCode==121, "1129, 190 & 121",
                                         ifelse(enrollnm$SchoolCode==189 | enrollnm$SchoolCode==132 |
                                           enrollnm$SchoolCode==1121,"189, 132 & 1121",
                                           ifelse(enrollnm$SchoolCode==116 | enrollnm$SchoolCode==1122 |
                                                enrollnm$SchoolCode==3071, "116, 1122 &3071",
                                             ifelse(enrollnm$SchoolCode==222 | enrollnm$SchoolCode==170,
                                                   "222 & 170",
                                               ifelse(enrollnm$SchoolCode==1118 | enrollnm$SchoolCode==125,
                                                    "1118 & 125",
                                                  ifelse(enrollnm$SchoolCode==101 | enrollnm$SchoolCode==137,
                                                      "101 & 137", enrollnm$SchoolCode))))))))))))))))
enrollnum<-enrollnm[c(4:25,27)]
enrollnum$SchoolCode<-enrollnum$Building
building<-join(enrollnum, DCschools,by="SchoolCode")
DCSchool.Enroll<-DCSchool.Enroll[-c(15:17)]
building<-building[-c(23)]

DCSchoolFin<-rbind(DCSchool.Enroll,building, by="SchoolCode")

DCSchoolFin$Level<-ifelse(DCSchoolFin$X12=='0' & DCSchoolFin$X05=='0',"Elementary",
                          ifelse(DCSchoolFin$X12=='0' & DCSchoolFin$X03=='0',"Middle",
                                 ifelse(DCSchoolFin$X03=='0' & DCSchoolFin$X05=='0',"High","Mixed")))
DCSchoolFin<-DCSchoolFin[-c(16:30)]

DCSchoolFin$totalSQFT<-as.numeric(gsub(",","",DCSchoolFin$totalSQFT))
DCSchoolFin$maxOccupancy<-as.numeric(gsub(",","",DCSchoolFin$maxOccupancy))
DCSchoolFin$TotalExp9815<-(sub("\\$","",DCSchoolFin$TotalExp9815))
DCSchoolFin$TotalAllot1621<-(sub("\\$","",DCSchoolFin$TotalAllot1621))
DCSchoolFin$LifetimeBudget<-(sub("\\$","",DCSchoolFin$LifetimeBudget))
DCSchoolFin$TotalExp9815<-as.numeric(gsub(",","",DCSchoolFin$TotalExp9815))
DCSchoolFin$TotalAllot1621<-as.numeric(gsub(",","",DCSchoolFin$TotalAllot1621))
DCSchoolFin$LifetimeBudget<-as.numeric(gsub(",","",DCSchoolFin$LifetimeBudget))

DCSchoolFin$SPED<-as.numeric(DCSchoolFin$Level.1)+as.numeric(DCSchoolFin$Level.2)+
  as.numeric(DCSchoolFin$Level.3)+as.numeric(DCSchoolFin$Level.4)

DCSchoolFin$AtRiskPer<-as.numeric(DCSchoolFin$At_Risk)/as.numeric(DCSchoolFin$Total.Enrolled)
DCSchoolFin$SPEDPer<-DCSchoolFin$SPED/as.numeric(DCSchoolFin$Total.Enrolled)
DCSchoolFin$ESLPer<-as.numeric(DCSchoolFin$Limited.English.Proficient)/as.numeric(DCSchoolFin$Total.Enrolled)
DCSchoolFin$SqFtPerEnroll<-DCSchoolFin$totalSQFT/as.numeric(DCSchoolFin$Total.Enrolled)
DCSchoolFin$LTBudgetPerEnroll<-DCSchoolFin$LifetimeBudget/as.numeric(DCSchoolFin$Total.Enrolled)
DCSchoolFin$LTBudgetPerSqFt<-DCSchoolFin$LifetimeBudget/DCSchoolFin$totalSQFT

write.csv(DCSchoolFin,"/Users/katerabinowitz/Documents/CodeforDC/school-modernization/Output Data/DCSchoolsRough.csv",row.names=FALSE)


##level needs to be updated w definitions sent over
## administrative cluster is NOT feeder! 21CF will send over feeder tomorrow
 # some schools do not yet have feeder
##allocate SQFT based on enrollment proportion of schools where shared building