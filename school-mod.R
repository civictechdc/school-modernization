library(stringr)
library(plyr)
library(rgdal)
library(gtools)
###Open Schools Only###

### Read in data ###
### Read in data ###
### Read in data ###
#DCPS data
DCPS.Facility<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/Facility%20Condition-Table%201.csv",
                        stringsAsFactors=FALSE, strip.white=TRUE)[c(1:3,5,55,59,68,70)]
colnames(DCPS.Facility)<-c("School.Short","School", "Level","totalSQFT","ProjectType","MajorExp9815","TotalAllotandPlan1621","LifetimeBudget")
DCPS.Facility$School<-tolower(DCPS.Facility$School)
DCPS.Facility<-subset(DCPS.Facility,DCPS.Facility$School.Short!="" & DCPS.Facility$School!="" & 
                        !(grepl("omit",DCPS.Facility$School) | grepl("close",DCPS.Facility$School) | 
                         grepl("demolished",DCPS.Facility$School) | grepl("swing",DCPS.Facility$School)))

DCPS.LastYr<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/Last%20Major%20Construction-Table%201.csv",
                      stringsAsFactors=FALSE, strip.white=TRUE)[c(2:4)]
colnames(DCPS.LastYr)<-c("School.Short","ProjectPhase","YrComplete")

appC.DCPS<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/DCPS%20Building%20Condition%20Dat%20(2-Table%201.csv",
                    stringsAsFactors=FALSE, strip.white=TRUE, skip=1)[c(2,4,6:8,10,12)]
colnames(appC.DCPS)<-c("Agency","School","SCHOOLCODE","School.Short","Address","maxOccupancy","Enroll.Cap")
appC.DCPS<-subset(appC.DCPS,grepl("^[[:digit:]]",appC.DCPS$SCHOOLCODE))

budgetDCPS<-read.csv("https://raw.githubusercontent.com/codefordc/dcps-budget/master/app/data/data.csv",
                     stringsAsFactors=FALSE, strip.white=TRUE)[c(1:6,8,10)]
budgetDCPSunq<-budgetDCPS[!duplicated(budgetDCPS[,1:2]),]

Feeder<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/Simple%20Fdrs%20for%2014-15-Table%201.csv",
                 stringsAsFactors=FALSE, strip.white=TRUE)[c(1:2,4:5)]
colnames(Feeder)<-c("School.Short","SCHOOLCODE","FeederMS","FeederHS")
Feeder<-subset(Feeder,Feeder$SCHOOLCODE!=999)

##dcps and pcs datasets
enroll<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/2014-15%20Enrollment%20Audit.csv",
                 stringsAsFactors=FALSE, strip.white=TRUE)[c(1,4:21,25:30)]
enroll$SCHOOLCODE<-enroll$School.ID

##pcs datasets
appC.Charter<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/Charter%20capacities-Table%201.csv",
                       stringsAsFactors=FALSE, strip.white=TRUE)[c(1:7,10)]
colnames(appC.Charter)<-c("LEA.Code","SchoolGroupCode","School","Address","formerDCPS","maxOccupancy","totalSQFT","EnrollCeiling")
appC.Charter<-subset(appC.Charter,appC.Charter$SchoolGroupCode!="")

CharterLoc<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/schools.csv",
                     stringsAsFactors=FALSE, strip.white=TRUE)[c(2:5,8,12:14)]

CharterDataSheet<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/Appendix%20B_Public%20Charter%20Facility%20Data%20Sheet%20for%20SY14-15%20NH.csv",
                           stringsAsFactors=FALSE, strip.white=TRUE)

### Create DCPS dataset ###
### Create DCPS dataset ###
### Create DCPS dataset ###
textedit<-function (x) {
  x<-tolower(x)
  x<-gsub("ec","",x)
  x<-gsub("es","",x)
  x<-gsub("middle","ms",x)
  x<-gsub("high","hs",x)
  x<-gsub("elementary","",x)
  x<-gsub("[.]","",x)
  x<-gsub("[-]","",x)
  x<-gsub("[*]","",x)
  x<-gsub("[[:space:]]","",x)
}
#Join AppC and Major Construction Last Year
DCPS.LastYr$School.Short<-textedit(DCPS.LastYr$School.Short)
appC.DCPS$School.Short<-textedit(appC.DCPS$School.Short)

join1<-join(appC.DCPS,DCPS.LastYr,by="School.Short",type="inner")

LastYrOut<-subset(DCPS.LastYr,!(DCPS.LastYr$School.Short %in% join1$School.Short))
appCout<-subset(appC.DCPS,!(appC.DCPS$School %in% join1$School))
LastYrOut$Short2<- substr(LastYrOut$School.Short, start=1, stop=7)
appCout$Short2<- substr(appCout$School.Short, start=1, stop=7)

join2<-join(LastYrOut,appCout,by="Short2",type="inner")

LastYrOut2<-subset(LastYrOut,!(LastYrOut$Short2 %in% join2$Short2))
appCout2<-subset(appCout,!(appCout$School %in% join2$School))
join2<-join2[-c(4,8)]

LastYrOut2$School.Short<-ifelse(LastYrOut2$School.Short=="bannekerhs", "benjaminbannekerhs",
              ifelse(LastYrOut2$School.Short=="adamsoysteradams","oysteradamsbilingual(adams)",
                ifelse(LastYrOut2$School.Short=="oysteroysteradams","oysteradamsbilingual(oyster)",
                  ifelse(LastYrOut2$School.Short=="wteducationcampus","wt",
                    ifelse(LastYrOut2$School.Short=="hdwoodsonhs","woodson,hdhs",
                      ifelse(LastYrOut2$School.Short=="hearstms","hearst",
                             LastYrOut2$School.Short ))))))
join3<-join(LastYrOut2,appCout2,by="School.Short",type="full")
join3<-join3[-c(4)]

DCPS.appC.Yr<-rbind(join1,join2,join3)
rm("join1", "join2", "join3","LastYrOut","LastYrOut2","appCout","appCout2")

#Join AppC.Yr and Facility
DCPS.appC.Yr$SchoolJoin<-textedit(DCPS.appC.Yr$School)
DCPS.Facility$SchoolJoin<-textedit(DCPS.Facility$School)
DCPS.appC.Yr$School.Short<-textedit(DCPS.appC.Yr$School.Short)
DCPS.Facility$School.Short<-textedit(DCPS.Facility$School.Short)

join1<-join(DCPS.appC.Yr,DCPS.Facility,by="School.Short",type="inner")
join1<-join1[c("Agency","School","SCHOOLCODE","School.Short","Address","maxOccupancy","Enroll.Cap",
               "ProjectPhase","YrComplete","SchoolJoin","Level","totalSQFT","ProjectType",
               "MajorExp9815","TotalAllotandPlan1621","LifetimeBudget")]

appCout<-subset(DCPS.appC.Yr,!(DCPS.appC.Yr$School.Short %in% join1$School.Short))
Facout<-subset(DCPS.Facility,!(DCPS.Facility$School.Short %in% join1$School.Short))

join2<-join(appCout,Facout,by="SchoolJoin",type="inner")
join2<-join2[c("Agency","School","SCHOOLCODE","School.Short","Address","maxOccupancy","Enroll.Cap",
               "ProjectPhase","YrComplete","SchoolJoin","Level","totalSQFT","ProjectType",
               "MajorExp9815","TotalAllotandPlan1621","LifetimeBudget")]

appCout2<-subset(appCout,!(appCout$SchoolJoin %in% join2$SchoolJoin))
Facout2<-subset(Facout,!(Facout$SchoolJoin %in% join2$SchoolJoin))

appCout2$SchoolJoin<-ifelse(appCout2$SchoolJoin=="brooklandeducationcampus@bunkerhill","formerbrookland@bunkerhill/ms",
                      ifelse(appCout2$SchoolJoin=="malcolmxschool","malcolmxatgreen",
                        ifelse(appCout2$SchoolJoin=="capitolhillmontsorischool@logan","capitolhillmontsori@logan/ms",
                          ifelse(appCout2$SchoolJoin=="lukecmoorehsschool","lukemoorehsschool",
                            ifelse(appCout2$SchoolJoin=="prosptlearningcenter","schoolwithinschool@goding",
                                ifelse(appCout2$SchoolJoin=="oysteradamsbilingualschool(adams)","adamsoysterbilingualschool(adams)",
                                  ifelse(appCout2$SchoolJoin=="woodson,hdhs","hdwoodsonhs",
                                    ifelse(appCout2$SchoolJoin=="sharpehealthschool","formerspedschool",
                                           appCout2$SchoolJoin))))))))
appCout2$SchoolJoin<-ifelse(appCout2$School.Short=="brooklandms","brooklandmsschool",appCout2$SchoolJoin)
join3<-join(appCout2,Facout2,by="SchoolJoin",type="full")

DCPS.appC.Facility<-rbind(join1,join2,join3)[-c(10)]
rm("join1", "join2", "join3","Facout","Facout2","appCout","appCout2")

#Join budget and DCPS.appC.Facility
IndptBuilding<-subset(DCPS.appC.Facility,!grepl("/",DCPS.appC.Facility$SCHOOLCODE))
DptBuilding<-subset(DCPS.appC.Facility,grepl("/",DCPS.appC.Facility$SCHOOLCODE))

IndptBuilding$SCHOOLCODE<-ifelse(IndptBuilding$School.Short=="jeffersonms",415,
                      ifelse(IndptBuilding$School.Short=="langley",235,
                        ifelse(IndptBuilding$School.Short=="vanns",331,
                         ifelse(IndptBuilding$School.Short=="capitolhillmontsori@logan",629,
                           ifelse(IndptBuilding$School.Short=="schoolwithinaschool@goding",943,
                             ifelse(IndptBuilding$School.Short=="brooklandms",9,
                              ifelse(IndptBuilding$School.Short=="oysteradamsbilingual(adams)",292,
                                ifelse(IndptBuilding$School.Short=="riverterrace",304,
                                  ifelse(IndptBuilding$School.Short=="eliothinems",407,
                                   IndptBuilding$SCHOOLCODE)))))))))

join1<-join(IndptBuilding,budgetDCPSunq,by="SCHOOLCODE",type="inner")
join1$BuildingCode<-join1$SCHOOLCODE

Bout<-subset(budgetDCPSunq,!(budgetDCPSunq$SCHOOLCODE %in% join1$SCHOOLCODE))

school <- DptBuilding[rep(row.names(DptBuilding),2),]
school$BuildingCode<-school$SCHOOLCODE
school<-school[(3:10),-(3)]
buildingcode<-as.data.frame(c(459,452,312,435,458,456,462,265))
colnames(buildingcode)<-"SCHOOLCODE"
tojoin<-cbind(school,buildingcode)

join2<-join(tojoin,Bout,by="SCHOOLCODE",type="full")

appC.budget<-rbind(join1,join2)
rm("join1","join2","IndptBuilding","DptBuilding","school","tojoin","Bout","appOut")

#Join with Feeder Patterns
appC.budget$SCHOOLCODE<-as.numeric(appC.budget$SCHOOLCODE)
Feeder$SCHOOLCODE<-ifelse(Feeder$School.Short=="MCKINLEY  MS",435,
                          Feeder$SCHOOLCODE)

appC.budget$SCHOOLCODE<-ifelse(appC.budget$School.Short=="malcolmx@green",244,
                          ifelse(appC.budget$School.Short=="wheatley",337,
                            ifelse(appC.budget$School.Short=="hardyms",2010,
                              ifelse(appC.budget$School.Short=="schoolwithoutwallshs",243,
                                ifelse(appC.budget$School.Short=="washingtonmeths",123,
                                  ifelse(appC.budget$School.Short=="capitolhillmontsori@logan",269,
                                    ifelse(appC.budget$School.Short=="schoolwithinaschool@goding",242,
                                      ifelse(appC.budget$School.Short=="brooklandms",346,
                                           appC.budget$SCHOOLCODE))))))))
appC.budget$SCHOOLCODE<-ifelse(appC.budget$School.Short=="brooklandms",346,
                          ifelse(appC.budget$School.Short=="eaton",232,
                            ifelse(appC.budget$School.Short=="oysteradamsbilingual(oyster)",292,
                                 appC.budget$SCHOOLCODE)))
appC.budget$SCHOOLCODE<-ifelse(appC.budget$SCHOOLCODE==296,293,
                          ifelse(appC.budget$SCHOOLCODE==235,134,
                            ifelse(appC.budget$SCHOOLCODE==232,407,
                              ifelse(appC.budget$SCHOOLCODE==346,219,
                                ifelse(appC.budget$SCHOOLCODE==292,201,
                                  ifelse(appC.budget$SCHOOLCODE==456,459,
                                    ifelse(appC.budget$SCHOOLCODE==9,346,
                                      ifelse(appC.budget$SCHOOLCODE==232,232,
                                      appC.budget$SCHOOLCODE))))))))
DCPS<-join(appC.budget,Feeder,by="SCHOOLCODE",type="left")
DCPS$School<-ifelse(is.na(DCPS$School),DCPS$SCHOOLNAME,DCPS$School)
DCPS$Agency<-ifelse(is.na(DCPS$Agency),"DCPS",DCPS$Agency)
DCPS<-DCPS[c(1:3,5:15,17:18,21,25,26)]

#Join with enroll
DCPS$SCHOOLCODE<-ifelse(DCPS$School=="Wheatley Education Campus",335,
                    ifelse(DCPS$School=="Hardy Middle School",246,
                    ifelse(DCPS$School=="Jefferson Middle School",433,
                      ifelse(DCPS$School=="School Without Walls High School",466,
                        ifelse(DCPS$School=="Bruce-Monroe Elementary School @ Park View",296,
                          ifelse(DCPS$School=="Washington Metropolitan High School",474,
                            ifelse(DCPS$School=="Brookland Education Campus @ Bunker Hill",346,
                                ifelse(DCPS$School=="Malcolm X Elementary School",308,
                                  ifelse(DCPS$School=="Capitol Hill Montessori School @ Logan",360,
                                    ifelse(DCPS$School=="CHOICE Academy",947,
                                      ifelse(DCPS$School=="Incarcerated Youth Program",480,
                                        ifelse(DCPS$School=="Youth Services Center",861,
                                          ifelse(DCPS$School=="Dorothy Height ES",000,
                                            ifelse(DCPS$School=="Langley Education Campus",370,
                                                  DCPS$SCHOOLCODE
                                            ))))))))))))))
DCPS.Final<-join(DCPS,enroll,by="SCHOOLCODE",type="left")

###Final DCPS dataset
money<-function(x) {
  x<-(sub("\\$","",x))
}
numeric<- function(x) {
  x<-as.numeric(gsub(",","",x))
}

DCPS.Final$SPED<-Level.1+Level.2+Level.2+Level.3
DCPS.Final<-DCPS.Final[-c(20:22,24:38,40:43,45)]

DCPS.Final$totalSQFT<-numeric(DCPS.Final$totalSQFT)
DCPS.Final$maxOccupancy<-numeric(DCPS.Final$maxOccupancy)

DCPS.Final$MajorExp9815<-money(DCPS.Final$MajorExp9815)
DCPS.Final$TotalAllotandPlan1621<-money(DCPS.Final$TotalAllotandPlan1621)
DCPS.Final$LifetimeBudget<-money(DCPS.Final$LifetimeBudget)

DCPS.Final$MajorExp9815<-numeric(DCPS.Final$MajorExp9815)
DCPS.Final$TotalAllotandPlan1621<-numeric(DCPS.Final$TotalAllotandPlan1621)
DCPS.Final$LifetimeBudget<-numeric(DCPS.Final$LifetimeBudget)

attach(DCPS.Final)

DCPS.Final$AtRiskPer<-At_Risk/Total.Enrolled
DCPS.Final$SPEDPer<-SPED/Total.Enrolled
DCPS.Final$ESLPer<-Limited.English.Proficient/Total.Enrolled
DCPS.Final$SqFtPerEnroll<-totalSQFT/Total.Enrolled

DCPS.Final$SpentPerEnroll<-MajorExp9815/Total.Enrolled
DCPS.Final$SpentPerSqFt<-MajorExp9815/totalSQFT

write.csv(DCPS.Final,
"/Users/katerabinowitz/Documents/CodeforDC/school-modernization/Output Data/DCPS_Master_114.csv",
row.names=FALSE)


### END OF UPDATES FOR 1/14 ###



###Create Charter dataset###
###Create Charter dataset###
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



##allocate SQFT based on enrollment proportion of schools where shared building