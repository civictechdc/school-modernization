library(stringr)
library(plyr)
library(rgdal)
library(gtools)
### Read in data ###
### Read in data ###
### Read in data ###
atRisk<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/At%20risk_DCPS_FY15_Ext.csv",
                 stringsAsFactors=FALSE, strip.white=TRUE)[c(1:4)]
atRisk<-subset(atRisk, atRisk$Sector==1)[2:4]
colnames(atRisk)<-c("SCHOOLNAME","atRisk15","Enrollment15")

appC.Charter<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/Charter%20capacities-Table%201.csv",
                       stringsAsFactors=FALSE, strip.white=TRUE)[c(1:10)]
colnames(appC.Charter)<-c("LEA.Code","School.Code","School","Address","formerDCPS","maxOccupancy","totalSQ","Enrolled","SqFtperStudent","EnrollCeiling")
appC.Charter<-subset(appC.Charter,appC.Charter$Enrolled!="")

appC.DCPS<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/DCPS%20Building%20Condition%20Dat%20(2-Table%201.csv",
                    stringsAsFactors=FALSE, strip.white=TRUE, skip=1)[c(2,4,5:14)]
colnames(appC.DCPS)<-c("Agency","Name","totalSQ","Program","School","Address","Enrolled","EnrollCap.Perm","EnrollCap.Port","Enroll.Cap","EnrollUtilization","SqFtperStudent")
DCPSenrolled<-subset(appC.DCPS,!(is.na(appC.DCPS$Enrolled)))

budgetDCPS<-read.csv("https://raw.githubusercontent.com/codefordc/dcps-budget/master/app/data/data.csv",
                     stringsAsFactors=FALSE, strip.white=TRUE)[c(1:8,11)]
budgetDCPSunq<-budgetDCPS[!duplicated(budgetDCPS[,1:2]),]

CharterPop<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/PCS_Student_Enrollment_by_School__2014-15_.csv",
                     stringsAsFactors=FALSE, strip.white=TRUE)[c(1,3,28)]

CharterLoc<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/schools.csv",
                     stringsAsFactors=FALSE, strip.white=TRUE)[c(2:5,8,12:14)]

### Create DCPS dataset ###
DCPSenrolled$SCHOOLCODE<-ifelse(DCPSenrolled$Program=="452/462", "452",
                            ifelse(DCPSenrolled$Program=="459/456", "459",
                              ifelse(DCPSenrolled$Program=="201","292",
                                ifelse(DCPSenrolled$Program=="360", "629",
                                  ifelse(DCPSenrolled$Program=="433","415",
                                    ifelse(DCPSenrolled$Program=="175","943",
                                           DCPSenrolled$Program))))))
                                
DCPSfactors<-join(DCPSenrolled, budgetDCPSunq, by="SCHOOLCODE",type="left")
DCPS<-DCPSfactors[c(1:3,6:7,12:13,15,16,20,21)]
colnames(DCPS)<-c("Agency","School","totalSQFT","Address","Enrolled","SqFtperStudent","SchoolCode","Longitude",
                  "Latitude","Ward","AtRiskPct")

###Create Charter dataset###
PCSfactors<-join(appC.Charter, CharterPop, by="School.Code",type="inner")[c(1:10,12)]

nomatch<-subset(appC.Charter,!(appC.Charter$School.Code %in% CharterPop$School.Code))
PopnoMatch<-subset(CharterPop,(CharterPop$LEA.Code %in% nomatch$LEA.Code))

PopnoMatch$SchoolGroupCode<-ifelse(PopnoMatch$School.Code==182 | PopnoMatch$School.Code==184 |
                                     PopnoMatch$School.Code==1207, "1207,184 & 182",
                              ifelse(PopnoMatch$School.Code==102 | PopnoMatch$School.Code==109,
                                     "102 & 109",
                                ifelse(PopnoMatch$School.Code==1110 | PopnoMatch$School.Code==218,
                                       "1110 & 218",
                                  ifelse(PopnoMatch$School.Code==1206 | PopnoMatch$School.Code==1138,
                                         "1206 & 1138",
                                    ifelse(PopnoMatch$School.Code==1211 | PopnoMatch$School.Code==1113,
                                           "1211 & 1113",
                                      ifelse(PopnoMatch$School.Code==362 | PopnoMatch$School.Code==361,
                                             "362 & 361",
                                        ifelse(PopnoMatch$School.Code==363 | PopnoMatch$School.Code==364,
                                               "363 & 364",
                                          ifelse(PopnoMatch$School.Code==365 | PopnoMatch$School.Code==366,
                                                 "365 & 366",
                                            ifelse(PopnoMatch$School.Code==236 | PopnoMatch$School.Code==237,
                                                  "236 & 237",
                                              ifelse(PopnoMatch$School.Code==209 | PopnoMatch$School.Code==242 |
                                                       PopnoMatch$School.Code==214, "209, 242 & 214",
                                                ifelse(PopnoMatch$School.Code==1129 | PopnoMatch$School.Code==190
                                                       | PopnoMatch$School.Code==121, "1129, 190 & 121",
                                                  ifelse(PopnoMatch$School.Code==189 | PopnoMatch$School.Code==132 |
                                                           PopnoMatch$School.Code==1121,"189, 132 & 1121",
                                                    ifelse(PopnoMatch$School.Code==116 | PopnoMatch$School.Code==1122 |
                                                             PopnoMatch$School.Code==3071, "116, 1122 &3071",
                                                      ifelse(PopnoMatch$School.Code==222 | PopnoMatch$School.Code==170,
                                                             "222 & 170",
                                                        ifelse(PopnoMatch$School.Code==1118 | PopnoMatch$School.Code==125,
                                                               "1118 & 125",
                                                          ifelse(PopnoMatch$School.Code==101 | PopnoMatch$School.Code==137,
                                                                 "101 & 137", PopnoMatch$School.Code))))))))))))))))
SchoolGroupsum<-aggregate(PopnoMatch$At.Risk, by=list(PopnoMatch$SchoolGroupCode), FUN=sum, na.rm=TRUE)
colnames(SchoolGroupsum)<-c("School.Code","At.Risk")

match<-join(nomatch,SchoolGroupsum, by="School.Code",type="left")
PCSFactor<-rbind(PCSfactors,match)
PCSFactor$Agency<-rep("PCS",93)
PCSFactor$Enrolled<-as.numeric(gsub(",","",PCSFactor$Enrolled))
PCSFactor$ATRISKPCT<-PCSFactor$At.Risk/PCSFactor$Enrolled

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
PCSFactor$SchoolGroupCode<-PCSFactor$School.Code
CharterLoc<-CharterLoc[!duplicated(CharterLoc[,9]),]
Charters<-join(PCSFactor,CharterLoc,by="SchoolGroupCode",type="left")
Charters$ward<-gsub("Ward ","",Charters$ward)

PCS<-Charters[c(2:4,7:9,12,13,20:22)]
colnames(PCS)<-c("SchoolCode","School","Address","totalSQFT","Enrolled","SqFtperStudent",
                "Agency","AtRiskPct","Latitude","Longitude","Ward")

### DC Schools ###
### DC Schools ###
### DC Schools ###
DCSchools<-rbind(DCPS,PCS)
DCSchools$totalSQFT<-as.numeric(gsub(",","",DCSchools$totalSQFT))
DCSchools$Enrolled<-as.numeric(gsub(",","",DCSchools$Enrolled))
DCSchools$SqFtperStudent<-as.numeric(gsub(",","",DCSchools$SqFtperStudent))

DCSchools$SQFTgroup<-quantcut(DCSchools$totalSQFT,4,na.rm=TRUE)
DCSchools$Enrollgroup<-quantcut(DCSchools$Enrolled,4,na.rm=TRUE)
DCSchools$SQFTpergroup<-quantcut(DCSchools$SqFtperStudent,4,na.rm=TRUE)

DCSchools$FakeExpend<-sample(10^8,198,replace=TRUE)
write.csv(DCSchools,"/Users/katerabinowitz/Documents/CodeforDC/school-modernization/Output Data/DCSchoolsRough.csv",row.names=FALSE)
