const { Lesson } = require('../models');

module.exports = async (req, res) => {
    // Basic security: only allow if no lessons exist or if a specific query param is present?
    // For now, let's just run it. The user requested it.
    
    try {
        const lessons = [
            {
                title: 'Home Row Basics',
                difficulty: 'Beginner',
                content: 'a s d f j k l ; a s d f j k l ; lad fad dad sad lass fall all ask add as a dad asks a lad as a sad lad asks a dad dad has a salad a lad had a dad asks a sad lad',
                order: 1,
                image: '/images/lessons/lesson_home.svg'
            },
            {
                title: 'Top Row Basics',
                difficulty: 'Beginner',
                content: 'q w e r t y u i o p q w e r t y u i o p pot top rot tot pop port tire tree root prop to a top pot a tree root rot a tire pop a port to a proper top port',
                order: 2,
                image: '/images/lessons/lesson_top.svg'
            },
            {
                title: 'Bottom Row Basics',
                difficulty: 'Beginner',
                content: 'z x c v b n m z x c v b n m zap cab van ban man can zen zone zoom zero zebra zigzag jazz buzz fuzz fizz maze daze graze craze braze glaze blaze',
                order: 3,
                image: '/images/lessons/lesson_bottom.svg'
            },
            {
                title: 'Number Row Basics',
                difficulty: 'Intermediate',
                content: '1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 11 22 33 44 55 66 77 88 99 00 123 456 789 098 765 432 10 1990 2024 365 days 24 hours 60 mins 100 percent',
                order: 4,
                image: '/images/lessons/lesson_number.svg'
            },
            {
                title: 'Numpad Data Entry',
                difficulty: 'Advanced',
                content: '456 789 123 012 567 890 147 258 369 753 951 456 + 123 - 789 / 2 * 5 . 01 + 02 = 03 123456 789012 345678 901234 5000 1000',
                order: 6,
                image: '/images/lessons/lesson_numpad.svg'
            },
            {
                title: 'Advanced Symbols',
                difficulty: 'Intermediate',
                content: '! @ # $ % ^ & * ( ) _ + ! @ # $ % ^ & * ( ) _ + email@test.com #hashtag $100 50% off (brackets) [squares] {curlies} <tags> function() { return true; }',
                order: 5,
                image: '/images/lessons/lesson_symbols.svg'
            },
            {
                title: 'Master All Keys',
                difficulty: 'Expert',
                content: 'The quick brown fox jumps over the lazy dog! 1234567890 @ # $ % & * ( ) _ + - = [ ] { } | ; : " , . < > ? A journey of 1000 miles begins with a single step. Code: const x = 10; if (x > 5) { console.log("Hello World!"); }',
                order: 7,
                image: '/images/lessons/lesson_master.svg'
            },
        ];

        let createdCount = 0;
        let updatedCount = 0;

        for (const data of lessons) {
            const exists = await Lesson.findOne({ where: { title: data.title } });
            if (exists) {
                await exists.update(data);
                updatedCount++;
            } else {
                await Lesson.create(data);
                createdCount++;
            }
        }

        res.json({
            status: 'success',
            message: 'Database seeded successfully',
            details: {
                created: createdCount,
                updated: updatedCount,
                total: lessons.length
            }
        });

    } catch (error) {
        console.error('Seeding error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to seed database',
            error: error.message
        });
    }
};
