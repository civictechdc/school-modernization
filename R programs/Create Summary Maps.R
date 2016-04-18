setwd("/Users/katerabinowitz/Documents/CodeforDC/school-modernization/Output Data")
library(plyr)
### Read in Data ###
### Read in Data ###
### Read in Data ###
DCSchools<-read.csv("https://raw.githubusercontent.com/codefordc/school-modernization/master/Output%20Data/DC_Schools_Master_114.csv",
                        stringsAsFactors=FALSE, strip.white=TRUE)
WardMap = readOGR("http://opendata.dc.gov/datasets/a4442c906559456eb6ef3ea0898fe994_32.geojson", "OGRGeoJSON")
ElemMap=readOGR("http://opendata.dc.gov/datasets/dddddabc2ae24acc82f756c76b81d2ec_19.geojson","OGRGeoJSON")
MiddleMap=readOGR("http://opendata.dc.gov/datasets/60a00fbc7b2c4721bd284addf9123718_17.geojson","OGRGeoJSON")
HSMap=readOGR("http://opendata.dc.gov/datasets/d2e0486155144b6d8e11e12469a64b1c_15.geojson","OGRGeoJson")

### Create Ward Map ###
### Create Ward Map ###
### Create Ward Map ###
WardSchools<-ddply(DCSchools,~Ward,summarise,
                   AllMajorExp=sum(MajorExp9815,na.rm=TRUE),
                   AllSqFt=sum(totalSQFT,na.rm=TRUE),
                   AllEnroll=sum(Total.Enrolled,na.rm=TRUE))
WardSchools$SpendPerSqFt<-WardSchools$AllMajorExp/WardSchools$AllSqFt
colnames(WardSchools)[1]<-"OBJECTID"

WardSchoolMap <- merge(WardMap,WardSchools, by="OBJECTID", all.x=TRUE)
writeOGR(WardSchoolMap, 'WardSchoolMap.geojson','WardSchoolMap', driver='GeoJSON',check_exists = FALSE)

### Create Elementary School Boundary Map ###
### Create Elementary School Boundary Map ###
### Create Elementary School Boundary Map ###
SchoolMapData<-DCSchools[c(2,3,27,28)]
SchoolMapData<-SchoolMapData[order(SchoolMapData$School),]

SchoolMapData$SCHOOLCODE<-ifelse(SchoolMapData$School=="Eaton Elementary School",232,
                            ifelse(SchoolMapData$School=="Oyster-Adams Bilingual School (Oyster)",292,
                              ifelse(SchoolMapData$School=="Langley Education Campus",965,
                                ifelse(SchoolMapData$School=="Moten Elementary School",920,
                                  ifelse(SchoolMapData$School=="Van Ness ES",972,
                                    ifelse(SchoolMapData$School=="Takoma Education Campus",3241,
                                           SchoolMapData$SCHOOLCODE))))))

ElemMapData<-ElemMap@data
ElemMapData$SCHOOLCODE<-gsub( "dcps_", "", ElemMapData$GIS_ID)

Elem<-join(ElemMapData,SchoolMapData,by="SCHOOLCODE",type="left")[c(5:6,8:9)]

ESMap<-merge(ElemMap,Elem,by="GIS_ID",all.x=TRUE)
writeOGR(ESMap, 'ESMap.geojson','ESMap', driver='GeoJSON',check_exists = FALSE)

### Create Middle School Boundary Map ###
### Create Middle School Boundary Map ###
### Create Middle School Boundary Map ###
MiddleMapData<-MiddleMap@data
MiddleMapData$SCHOOLCODE<-gsub( "dcps_", "", MiddleMapData$GIS_ID)

SchoolMapData$SCHOOLCODE<-ifelse(SchoolMapData$School=="Brookland MS",975,
                               ifelse(SchoolMapData$School=="Columbia Heights Education Campus",475,
                                      ifelse(SchoolMapData$School=="Jefferson Middle School",415,
                                             ifelse(SchoolMapData$School=="Oyster-Adams Bilingual School (Adams)",949,
                                                    ifelse(SchoolMapData$SCHOOLCODE==435,970,
                                                            SchoolMapData$SCHOOLCODE)))))

MS<-join(MiddleMapData,SchoolMapData,by="SCHOOLCODE",type="left")[c(5:6,8:9)]
MSMap<-merge(MiddleMap, MS,by="GIS_ID",all.x=TRUE)

writeOGR(MSMap, 'MSMap.geojson','MSMap', driver='GeoJSON',check_exists = FALSE)

### Create High School Boundary Map ###
### Create High School Boundary Map ###
### Create High School Boundary Map ###
