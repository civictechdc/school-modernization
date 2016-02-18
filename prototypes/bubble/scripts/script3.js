//**********************************************
// Define the datasets.
//**********************************************
var schools = (function(){
   var all = [], public = [], charter = [];
   d3.csv('data/data_master.csv', function (error, c) {
      // c is array of objects
      for (i = 0, j = c.length; i < j; i++){
         all.push(c[i]);
      }
      for (i = 0, j = all.length; i < j; i++){
         if (c[i].Agency === 'DCPS'){
            public.push(c[i]);
         }
      }

      for (i = 0, j = all.length; i < j; i++){
         if (c[i].Agency === 'PCS'){
            charter.push(c[i]);
         }
      }
   });

   return {
      all : all,
      public : public,
      charter: charter
   };
}());


