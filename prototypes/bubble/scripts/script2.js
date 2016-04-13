d3.csv('https://cdn.rawgit.com/codefordc/school-modernization/master/Output%20Data/DCSchools_FY1415_Master_46.csv', function(data){
    var bubble = new Bubble(),
        schools = {
        both: data,
        public: (function(d){
            return d.filter(function(item){
                if (item.Agency === 'DCPS'){
                    return item;
                }
            });
        }(data)),
        charter: (function(d){
            return d.filter(function(item){
                if (item.Agency === 'PCS'){
                    return item;
                }
            });
        }(data))
            },
        budgetState = null;

    // Initial
    setInitialGraph();

    // States
    // var budgetStates = {

    // };


    $('.budgetChange').each(function(){
        $(this).on('click', function(e){
            bubble.setBudget(e.target.id);
            bubble.change();
            makeSelected(e);
        });
    });

    $('.perChange').each(function(){
        $(this).on('click', function(e){
            
            makeSelected(e);
        });
    });

    $('.columnChange').each(function(){
        $(this).on('click', function(e){
            bubble.setColumn(e.target.id);
            bubble.change();
            makeSelected(e);
        });
    });

    $('.schoolChange').each(function(){
        $(this).on('click', function(e){
            bubble.setData(schools[e.target.id]);
            bubble.change();
            makeSelected(e);
        });
    });

    /*
    Budget =  bubble radius  =  Past, Future, Lifetime, Per Sq Ft, Per Student
    Per    =                    Per Square Ft, Per Student, Total
    Data   =  show school    =  District Schools, Charter Schools, All Schools
    Column =  splits         =  Agency, Grade Level, Ward, Feeder Pattern, Project Type
    */

    /* Utility Functions */
    function setInitialGraph(){
        bubble.setBudget('MajorExp9815')
        bubble.setData(schools.both);
        bubble.graph();
    }

    function makeSelected(e){
        $(e.target).addClass('selected');
        $(e.target).siblings().removeClass('selected');
    }

});



