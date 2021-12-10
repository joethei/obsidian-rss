import { expect } from 'chai';
import 'mocha';

describe("Calculator", () => {
    describe("Add", () => {
        it("Should return 3 when a = 1 and b = 2", () => {
            const result = 1 + 2;

            expect(result).to.equal(3);
        });
    })
});
