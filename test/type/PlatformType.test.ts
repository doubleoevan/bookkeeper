import PlatformType from 'type/PlatformType';

describe('PlatformType', () => {
    it('is iterable', () => {
        const platformTypes = [];
        for (const platformType of PlatformType) {
            platformTypes.push(platformType.type);
        }
        const types = ['Facebook', 'Instagram', 'WhatsApp', 'Twitter'];
        expect(platformTypes).toHaveLength(types.length);
        for (const type of types) {
            expect(platformTypes).toContain(type);
        }
    });

    it('is mappable', () => {
        const platformTypes = PlatformType.map(({type}: PlatformType) => type);
        const types = ['Facebook', 'Instagram', 'WhatsApp', 'Twitter'];
        expect(platformTypes).toHaveLength(types.length);
        for (const type of types) {
            expect(platformTypes).toContain(type);
        }
    });

    it('prints its type in string interpolation', () => {
        expect(`${PlatformType.Facebook}`).toEqual('Facebook');
    });

    it('reads its value from its type', () => {
        expect(PlatformType.fromType('Facebook')).toEqual(PlatformType.Facebook);
    });
})
