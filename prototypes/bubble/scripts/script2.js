d3.csv('data/data_final.csv', function(data){
    console.log("d3.csv");
    var bubble = new Bubble(),
        schools = {
            both: data,
            public: (function(d){
                console.log("public");
                    return d.filter(function(item){
                        if (item.Agency === 'DCPS'){
                            console.log("item.Agency: ", item.Agency);
                            return item;
                        }
                    });
                }(data)),
            charter: (function(d){
                console.log("charter");
                    return d.filter(function(item){
                        if (item.Agency === 'PCS'){
                            console.log("item.Agency: ", item.Agency);
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
        console.log("budgetChange");
        $(this).on('click', function(e){
            console.log("\n=== budgetChange.click.this:", $(this));
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
        console.log("perChange");
        $(this).on('click', function(e){
            console.log("\n=== perChange.click.this:", $(this));
            clearInactive();
            var state = $(e.target).data(budgetState);
            perState = $(e.target).data('key');
            bubble.setBudget(state);
            update(e);
        });
    });

    $('.columnChange').each(function(){
        console.log("columnChange");
        $(this).on('click', function(e){
            console.log("\n=== columnChange.click.this:", $(this));
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
        console.log("schoolChange");
        $(this).on('click', function(e){
            console.log("\n=== schoolChange.click.this:", $(this));
            clearInactive();
            bubble.setData(schools[e.target.id]);
            update(e);
        });
    });

    /* Utility Functions */
    function setInitialGraph(){
        console.log("setInitialGraph");
        bubble.reset_svg();
        bubble.setBudget('TotalAllotandPlan1621');
        budgetState = initialBudgetState;
        bubble.setData(schools.both);
        bubble.graph();
    }

    function setInitialMenuStates(){
        console.log("setInitialMenuStates");
        [$('#future'), $('#total'), $('#Agency'), $('#both')].forEach(function(item){
            makeSelected(null, item);
        });
    }

    function update(e){
        console.log("update");
        bubble.change();
        makeSelected(e);
    }

    function makeSelected(e, el){
        console.log("makeSelected");
        if (el){
            el.addClass('selected');
            el.siblings().removeClass('selected');
        } else {
            $(e.target).addClass('selected');
            $(e.target).siblings().removeClass('selected');
        }
    }

    function makeInactive(arr){;
        console.log("makeInactive");
        if (arr.length > 1){
            arr.forEach(function(item){
                $(item).addClass('invalid');
            });
        } else {
            $(arr).addClass('invalid');
        }
    }

    function clearInactive(){
        console.log("clearInactive");
        var $invalidsButtons = $('.invalid');
        $.each($invalidsButtons, function(i){
            $($invalidsButtons[i]).removeClass('invalid');
        });
    }

    function isSelected(el){
        console.log("isSelected");
        return $(el).hasClass('selected') ? true : false;
    }

});
