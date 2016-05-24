d3.csv('https://cdn.rawgit.com/codefordc/school-modernization/master/Output%20Data/DCSchools_FY1415_Master_412.csv', function(data){
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
        };
        
    var initialBudgetState = 'future',
        budgetState = null,
        perState = 'total';

    // Initial
    setInitialGraph();
    setInitialMenuStates();

    // States
    $('.budgetChange').each(function(){
        $(this).on('click', function(e){
            clearInactive();
            if (isSelected($('#ProjectType')) && e.target.id === 'future'){
                bubble.setColumn('FUTUREProjectType16_21');
            }
            if (isSelected($('#ProjectType')) && e.target.id !== 'future'){
                bubble.setColumn('ProjectType');
            }
            var state = $(e.target).data(perState);
            bubble.setBudget(state);

            // Set the budgetState
            budgetState = $(e.target).data('key');
            update(e);
        });
    });

    $('.perChange').each(function(){
        $(this).on('click', function(e){
            clearInactive();
            var state = $(e.target).data(budgetState);
            perState = $(e.target).data('key');
            bubble.setBudget(state);
            update(e);
        });
    });

    $('.columnChange').each(function(){
        $(this).on('click', function(e){
            clearInactive();
            if (e.target.id === 'FeederHS'){
                bubble.setData(schools.public);
                makeInactive([$('#charter'), $('#both')]);
            }
            if (e.target.id === 'Agency'){
                bubble.setData(schools.both);
                makeInactive([$('#charter'), $('#public')]);
            }
            if (e.target.id === 'ProjectType' && budgetState === 'future'){
                bubble.setColumn(e.target.dataset.alt);
            } else {
                bubble.setColumn(e.target.id);
            }
            
            update(e);
        });
    });

    $('.schoolChange').each(function(){
        $(this).on('click', function(e){
            clearInactive();
            bubble.setData(schools[e.target.id]);
            update(e);
        });
    });

    /* Utility Functions */
    function setInitialGraph(){
        bubble.reset_svg();
        bubble.setBudget('TotalAllotandPlan1621');
        budgetState = initialBudgetState;
        bubble.setData(schools.both);
        bubble.graph();
    }

    function setInitialMenuStates(){
        [$('#future'), $('#total'), $('#Agency'), $('#both')].forEach(function(item){
            makeSelected(null, item);
        });
    }

    function update(e){
        bubble.change();
        makeSelected(e);
    }

    function makeSelected(e, el){
        if (el){
            el.addClass('selected');
            el.siblings().removeClass('selected');
        } else {
            $(e.target).addClass('selected');
            $(e.target).siblings().removeClass('selected');
        }   
    }

    function makeInactive(arr){;
        if (arr.length > 1){
            arr.forEach(function(item){
                $(item).addClass('invalid');
            });
        } else {
            $(arr).addClass('invalid');
        }    
    }

    function clearInactive(){
        var $invalidsButtons = $('.invalid');
        $.each($invalidsButtons, function(i){
            $($invalidsButtons[i]).removeClass('invalid');
        });        
    }

    function isSelected(el){
        return $(el).hasClass('selected') ? true : false;
    }

});
