import ReactionType from 'type/ReactionType';

describe('ReactionType', () => {
    it('is iterable', () => {
        const reactionTypes = [];
        for (const reactionType of ReactionType) {
            reactionTypes.push(reactionType.type);
        }
        const types = ['Like', 'Love', 'Care', 'Wow', 'HaHa', 'Sad', 'Angry'];
        expect(reactionTypes).toHaveLength(types.length);
        for (const type of types) {
            expect(reactionTypes).toContain(type);
        }
    });

    it('is mappable', () => {
        const reactionTypes = ReactionType.map(({type}: ReactionType) => type);
        const types = ['Like', 'Love', 'Care', 'Wow', 'HaHa', 'Sad', 'Angry'];
        expect(reactionTypes).toHaveLength(types.length);
        for (const type of types) {
            expect(reactionTypes).toContain(type);
        }
    });

    it('prints its type in string interpolation', () => {
        expect(`${ReactionType.Wow}`).toEqual('Wow');
    });

    it('reads its value from its type', () => {
        expect(ReactionType.fromType('Wow')).toEqual(ReactionType.Wow);
    });
})
