import NavigationType from 'type/NavigationType';

describe('NavigationType', () => {
    it('is iterable', () => {
        const navigationTypes = [];
        for (const navigationType of NavigationType) {
            navigationTypes.push(navigationType.type);
        }
        const types = ['How', 'What', 'When', 'Where', 'Why'];
        expect(navigationTypes).toHaveLength(types.length);
        for (const type of types) {
            expect(navigationTypes).toContain(type);
        }
    });

    it('is mappable', () => {
        const navigationTypes = NavigationType.map(({type}: NavigationType) => type);
        const types = ['How', 'What', 'When', 'Where', 'Why'];
        expect(navigationTypes).toHaveLength(types.length);
        for (const type of types) {
            expect(navigationTypes).toContain(type);
        }
    });

    it('prints its type in string interpolation', () => {
        expect(`${NavigationType.How}`).toEqual('How');
    });

    it('reads its value from its type', () => {
        expect(NavigationType.fromType('How')).toEqual(NavigationType.How);
    });
})
