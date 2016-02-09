library(stringr)
library(plyr)
library(gtools)
library(reshape)
### Read in data ###
### Read in data ###
### Read in data ###
#DCPS data
DCPS.Facility<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/Facility%20Condition-Table%201.csv",
                        stringsAsFactors=FALSE, strip.white=TRUE)[c(1:3,5,55,59,68,70)]
colnames(DCPS.Facility)<-c("School.Short","School", "Level","totalSQFT","ProjectType","MajorExp9815","TotalAllotandPlan1621","LifetimeBudget")
DCPS.Facility$School<-tolower(DCPS.Facility$School)
DCPS.Facility<-subset(DCPS.Facility,DCPS.Facility$School.Short!="" & DCPS.Facility$School.Short!="NEW ELEM #1")

DCPS.Facility$Status<-ifelse(grepl("close|demolished|swing space",DCPS.Facility$School),"Closed","Open")

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
CharterLoc<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/schools.csv",
                     stringsAsFactors=FALSE, strip.white=TRUE)[c(2:5,8,12:14)]

CharterDataSheet<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/Appendix%20B_Public%20Charter%20Facility%20Data%20Sheet%20for%20SY14-15%20NH.csv",
                           stringsAsFactors=FALSE, strip.white=TRUE)[c(1:5,7:9)]
colnames(CharterDataSheet)<-c("LEA.Code","School.ID","School","Level","Address","maxOccupancy","totalSQFT", "Total.Enroll")
CharterDataSheet<-subset(CharterDataSheet,grepl("^[[:digit:]]",CharterDataSheet$LEA.Code))

CharterSpend<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/PCS%20Facility%20Allot.%20Sch-by-Sch.csv",
                       stringsAsFactors=FALSE, strip.white=TRUE)
CharterSpend<-subset(CharterSpend,CharterSpend$Master.PCS.List.1998.2014.15!="Grand Total")
CharterSchoolName<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/InputData/PCS%20School%20Names.csv",
                            stringsAsFactors=FALSE, strip.white=TRUE)[c(1:3)]
colnames(CharterSchoolName)<-c("Agency","Master.PCS.List.1998.2014.15","PCSName")

### Load functions ####
### Load functions ####
### Load functions ####

#textedit to remove inconsistencies in text and allow for better first round matching
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

#money and numeric to make text dollar fields numeric for editing
money<-function(x) {
  x<-(sub("\\$","",x))
}
numeric<- function(x) {
  x<-as.numeric(gsub(",","",x))
}

### Create DCPS dataset ###
### Create DCPS dataset ###
### Create DCPS dataset ###

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

DCPS.Facility$School.Short<-ifelse(DCPS.Facility$School.Short=="brucemonroe","brucemonroe-demolished",
                                   ifelse(DCPS.Facility$School.Short=="brucemonroe@parkview","brucemonroe",
                                          DCPS.Facility$School.Short))

join1<-join(DCPS.appC.Yr,DCPS.Facility,by="School.Short",type="inner")
join1<-join1[c("Agency","School","SCHOOLCODE","School.Short","Address","maxOccupancy","Enroll.Cap",
               "ProjectPhase","YrComplete","SchoolJoin","Level","totalSQFT","ProjectType",
               "MajorExp9815","TotalAllotandPlan1621","LifetimeBudget","Status")]

appCout<-subset(DCPS.appC.Yr,!(DCPS.appC.Yr$School.Short %in% join1$School.Short))
Facout<-subset(DCPS.Facility,!(DCPS.Facility$School.Short %in% join1$School.Short))

join2<-join(appCout,Facout,by="SchoolJoin",type="inner")
join2<-join2[c("Agency","School","SCHOOLCODE","School.Short","Address","maxOccupancy","Enroll.Cap",
               "ProjectPhase","YrComplete","SchoolJoin","Level","totalSQFT","ProjectType",
               "MajorExp9815","TotalAllotandPlan1621","LifetimeBudget","Status")]

appCout2<-subset(appCout,!(appCout$SchoolJoin %in% join2$SchoolJoin))
Facout2<-subset(Facout,!(Facout$SchoolJoin %in% join2$SchoolJoin))

appCout2$SchoolJoin<-ifelse(appCout2$SchoolJoin=="brooklandeducationcampus@bunkerhill","formerbrookland@bunkerhill/ms",
                      ifelse(appCout2$SchoolJoin=="dunbarhsschool(old)","dunbarhsschoolomitted",
                      ifelse(appCout2$SchoolJoin=="malcolmxschool","malcolmxatgreen",
                        ifelse(appCout2$SchoolJoin=="ballouhs(includstayprogram)","ballouhsschoolomitted",
                        ifelse(appCout2$SchoolJoin=="capitolhillmontsorischool@logan","capitolhillmontsori@logan/ms",
                          ifelse(appCout2$SchoolJoin=="lukecmoorehsschool","lukemoorehsschool",
                            ifelse(appCout2$SchoolJoin=="prosptlearningcenter","schoolwithinschool@goding",
                                ifelse(appCout2$SchoolJoin=="oysteradamsbilingualschool(adams)","adamsoysterbilingualschool(adams)",
                                  ifelse(appCout2$SchoolJoin=="woodson,hdhs","hdwoodsonhs",
                                    ifelse(appCout2$SchoolJoin=="sharpehealthschool","formerspedschool",
                                           appCout2$SchoolJoin))))))))))
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

join1<-join(IndptBuilding,budgetDCPSunq,by="SCHOOLCODE",type="left")

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
rm("join1","join2","IndptBuilding","DptBuilding","school","tojoin","Bout")

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

DCPS$FeederMS<-ifelse(DCPS$School=="Eaton Elementary School","Hardy MS",DCPS$FeederMS)

DCPS$School<-ifelse((is.na(DCPS$School) | grepl(" |swing space|closed|demolished",DCPS$School)),
                    DCPS$SCHOOLNAME,DCPS$School)
DCPS$School<-ifelse(is.na(DCPS$School),DCPS$School.Short,
                    ifelse(DCPS$School=="", "DCPS MultiSchool",DCPS$School))
DCPS$Agency<-ifelse(is.na(DCPS$Agency),"DCPS",DCPS$Agency)
DCPS<-DCPS[c(1:3,5:16,18:20,22,26,27)]

#Join with enroll
enroll<-subset(enroll, enroll$Sector!="TOTAL")
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
                                              ifelse(DCPS$School=="Prospect Learning Center",175,
                                                ifelse(DCPS$School=="Eaton Elementary School",232,
                                                  ifelse(DCPS$School=="Oyster-Adams Bilingual School (Oyster)",292,
                                                  DCPS$SCHOOLCODE
                                            )))))))))))))))))
DCPS.Final<-join(DCPS,enroll,by="SCHOOLCODE",type="left")

###Final DCPS dataset
DCPS.Final$SPED<-DCPS.Final$Level.1+DCPS.Final$Level.2+DCPS.Final$Level.2+DCPS.Final$Level.3
DCPS.Final<-DCPS.Final[-c(6,18,22:24,26:40,42:45)]

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
colnames(DCPS.Final)[c(15:17)]<-"longitude","latitude","Ward"

DCPS.Final<-DCPS.Final[-c(6)]
write.csv(DCPS.Final,
"/Users/katerabinowitz/Documents/CodeforDC/school-modernization/Output Data/DCPS_Master_114.csv",
row.names=FALSE)

###Create Charter dataset###
###Create Charter dataset###
###Create Charter dataset###

#Identify school open/close dates
melt<- melt(CharterSpend, id="Master.PCS.List.1998.2014.15")
melt<-subset(melt,melt$variable!="Totals")
melt$value<-money(melt$value)
melt$value<-numeric(melt$value)
melt$variable<-as.character(melt$variable)
melt$year<-as.numeric(gsub("[^\\d]+", "", melt$variable, perl=TRUE))
melt<-melt[order(melt$Master.PCS.List.1998.2014.15,melt$year),]

YrsOpen<-subset(melt,melt$value!=0)
OpenCount<-count(YrsOpen, "Master.PCS.List.1998.2014.15")

Open<-ddply(YrsOpen, .(Master.PCS.List.1998.2014.15), summarize,
            Open = min(year), 
            Close = max(year))
Years<-join(OpenCount,Open,by="Master.PCS.List.1998.2014.15")
Years$Open.Now<-ifelse(Years$Close==2015,1,0)

SpendLifetime<-join(CharterSpend,Years,by="Master.PCS.List.1998.2014.15")[-c(2:18)]
colnames(SpendLifetime)[c(2:3)]<-c("MajorExp9815","YearsOpen")

#Join charter school spend with extended school name
CharterSchoolName$Master.PCS.List.1998.2014.15<-ifelse(
  CharterSchoolName$PCSName=="LAYC Career Academy (Alternative School Category Latin American Youth Center)",
  "LAYC Career Academy Alt. School", CharterSchoolName$Master.PCS.List.1998.2014.15)
  
join1<-join(SpendLifetime,CharterSchoolName,by="Master.PCS.List.1998.2014.15", type="inner")

Smiss<-subset(SpendLifetime,!(SpendLifetime$Master.PCS.List.1998.2014.15 %in% join1$Master.PCS.List.1998.2014.15))
Smiss<-Smiss[order(Smiss$Master.PCS.List.1998.2014.15),]
Nmiss<-subset(CharterSchoolName,!(CharterSchoolName$Master.PCS.List.1998.2014.15 %in% join1$Master.PCS.List.1998.2014.15))
Nmiss<-Nmiss[order(Nmiss$Master.PCS.List.1998.2014.15),]
Nmiss<-subset(Nmiss,Nmiss$Master.PCS.List.1998.2014.15!="Center City (combined)" & 
                Nmiss$Master.PCS.List.1998.2014.15!="Hope Academy")
join2<-cbind(Smiss,Nmiss)[-c(1)]

CharterSpend.2<-rbind(join1,join2)
rm(join1,join2,melt,Nmiss,Open,OpenCount,Smiss,SpendLifetime,Years,YrsOpen)

CharterOpen<-subset(CharterSpend.2,CharterSpend.2$Open.Now==1)
CharterClose<-subset(CharterSpend.2,CharterSpend.2$Open.Now!=1)
  
#Join charter spend with enrollment
enrollCharter<-subset(enroll, enroll$Sector=="Charters")
CharterOpen$School.ID<-gsub("[^\\d]+", "", CharterOpen$PCSName, perl=TRUE)
CharterOpen$School.ID<-ifelse(CharterOpen$School.ID=="190","196",
                              ifelse(CharterOpen$Master.PCS.List.1998.2014.15=="E.L. Haynes Kansas Ave. High","1206",
                              CharterOpen$School.ID))
enrollCharter<-enrollCharter[order(enrollCharter$School.Name),]
join1<-join(CharterOpen,enrollCharter,by="School.ID",type="inner")
sMiss1<-subset(CharterOpen,!(CharterOpen$Master.PCS.List.1998.2014.15 %in% join1$Master.PCS.List.1998.2014.15))
eMiss1<-subset(enrollCharter,!(enrollCharter$School.Name %in% join1$School.Name))

sMiss1$Master.PCS.List.1998.2014.15<-ifelse(sMiss1$Master.PCS.List.1998.2014.15=="E.W. Stokes",
                                        "Elsie Whitlow Stokes Community Freedom PCS",
                                        ifelse(sMiss1$Master.PCS.List.1998.2014.15=="AppleTree  Riverside",
                                               "AppleTree Learning Center Southwest",
                                          ifelse(sMiss1$Master.PCS.List.1998.2014.15=="Capital City Upper School",
                                                  "Capital City High School PCS",
                                              ifelse(sMiss1$Master.PCS.List.1998.2014.15=="DCI, District of Columbia  International School",
                                                     "District of Columbia International School",
                                                ifelse(sMiss1$Master.PCS.List.1998.2014.15=="Friendship Collegiate",
                                                       "Friendship Woodson Collegiate Academy",
                                            sMiss1$Master.PCS.List.1998.2014.15)))))
sMiss1<-sMiss1[order(sMiss1$Master.PCS.List.1998.2014.15),]
eMiss1<-eMiss1[order(eMiss1$School.Name),]
join2<-cbind(eMiss1,sMiss1)[-c(35)]

PCS.Spend.Enrollment<-rbind(join1,join2)
PCS.Spend.Enrollment$SPED<-PCS.Spend.Enrollment$Level.1+PCS.Spend.Enrollment$Level.2+PCS.Spend.Enrollment$Level.3+PCS.Spend.Enrollment$Level.4
rm(join1, join2,eMiss1,sMiss1,enrollCharter)

# Add building data
# Note: where multiple buildings tied to the same school ID, sqft and multiple occupancy were summed.
# For mapping purposes, all locations will be shown with flag for schools where combined data
# For all other purposes, data will be unique to School.ID
CharterDataSheet$maxOccupancy<-numeric(CharterDataSheet$maxOccupancy)
CharterDataSheet$totalSQFT<-numeric(CharterDataSheet$totalSQFT)

Dup<-CharterDataSheet[duplicated(CharterDataSheet$School.ID), ]
Multi<-subset(CharterDataSheet,(CharterDataSheet$School.ID %in% Dup$School.ID))
Single<-subset(CharterDataSheet,!(CharterDataSheet$School.ID %in% Dup$School.ID))
Single$unqBuilding<-rep(1,100)
Fix<-subset(Multi, Multi$School.ID=="1207")
Fix$School.ID<-ifelse(Fix$School=="E.L. Haynes PCS - Kansas Avenue  Elementary School","1206","1207")
Fix$unqBuilding<-rep(1,2)
Multi<-subset(Multi, Multi$School.ID!="1207")

MultiSQFT<-aggregate(Multi$totalSQFT, by=list(Multi$School.ID), FUN=sum, na.rm=TRUE)
colnames(MultiSQFT)<-c("School.ID","totalSQFT")
MultiMax<-aggregate(Multi$maxOccupancy, by=list(Multi$School.ID), FUN=sum, na.rm=TRUE)
colnames(MultiMax)<-c("School.ID","maxOccupancy")
Sums<-join(MultiMax,MultiSQFT,by="School.ID", type="left")
Multi<-Multi[-c(6:7)]
Multi<-join(Multi,Sums,by="School.ID")
Multi$unqBuilding<-rep(0,24)

BuildingSum<-rbind(Single,Multi,Fix)

PCS.Spend.Enroll.Build<-join(PCS.Spend.Enrollment, BuildingSum, by="School.ID",type="left")
rm(Dup,Multi,Single,Fix,MultiSQFT,MultiMax,BuildingSum)

### Add Lat and Long, Ward
CharterLoc<-subset(CharterLoc, CharterLoc$lea_name!="District of Columbia Public Schools")
CharterLoc$School.ID<-CharterLoc$school_code
CharterLoc<-CharterLoc[c(6:9)]

#similarly the address and lat longs are potentially wrong where school ID overlaps. geocoding may be best.
Charters<-join(CharterEnroll,CharterLoc,by="School.ID",type="left")

Charters$Ward<-gsub("Ward ","",Charters$ward)
Charters$TotalAllotandPlan1621<-rep(NA,126)
Charters$LifetimeBudget<-rep(NA,126)
Charters$FeederMS<-rep(NA,126)
Charters$FeederHS<-rep(NA,126)
Charters$ProjectPhase<-rep(NA,126)
Charters$YrComplete<-rep(NA,126)
Charters$ProjectType<-rep(NA,126)
Charters$Agency<-rep("PCS",126)

attach(Charters)
Charters$AtRiskPer<-At_Risk/Total.Enroll
Charters$SPEDPer<-SPED/Total.Enroll
Charters$ESLPer<-Limited.English.Proficient/Total.Enroll
Charters$SqFtPerEnroll<-totalSQFT/Total.Enroll

Charters$SpentPerEnroll<-MajorExp9815/Total.Enroll
Charters$SpentPerSqFt<-MajorExp9815/totalSQFT

PCS.Final<-Charters[-c(1,3,15)]
colnames(PCS.Final)[1] <- "SCHOOLCODE"
colnames(PCS.Final)[7] <- "School"
colnames(PCS.Final)[6]<-"Total.Enrolled"

DCSchools<-rbind(DCPS.Final,PCS.Final)

write.csv(PCS.Final,
          "/Users/katerabinowitz/Documents/CodeforDC/school-modernization/Output Data/PCS_Master_114.csv",
          row.names=FALSE)

write.csv(DCSchools,
          "/Users/katerabinowitz/Documents/CodeforDC/school-modernization/Output Data/DC_Schools_Master_114.csv",
          row.names=FALSE)


##allocate SQFT based on enrollment proportion of schools where shared building 
#     - done for charters, need to do for DCPS
##figure out how to allocate atrisk, SPED and ESL where enrollment estimated
##check addresses 