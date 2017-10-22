'use strict';

exports.list = (req, res) => {
    res.json([
        {
            name : 'card1',
            info : 'info card 1'
        },
        {
            name : 'card2',
            info : 'info card 2'
        },
        {
            name : 'card3',
            info : 'info card 3'
        },
        {
            name : 'card4',
            info : 'info card 4'
        },
        {
            name : 'card5',
            info : 'info card 5'
        },
        {
            name : 'card6',
            info : 'info card 6'
        },
        {
            name : 'card7',
            info : 'info card 7'
        },
        {
            name : 'card8',
            info : 'info card 8'
        }
    ]);
};

exports.get = (req, res) => {
    res.json({
        name : 'card',
        info : 'info card'
    });
};