/// <reference path="./bubbleClass.ts"/>
d3.csv('data/data_master_412.csv', function (data) {
    var bubble = new Bubble(), schools = {
        both: data,
        public: (function (d) {
            return d.filter(function (item) {
                if (item.Agency === 'DCPS') {
                    return item;
                }
            });
        }(data)),
        charter: (function (d) {
            return d.filter(function (item) {
                if (item.Agency === 'PCS') {
                    return item;
                }
            });
        }(data))
    };
});
