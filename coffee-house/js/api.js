var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const BASE_URL = 'https://6kt29kkeub.execute-api.eu-central-1.amazonaws.com/api';
export function getFavoriteProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(`${BASE_URL}/products/favorites`);
            if (!res.ok) {
                throw new Error(`HTTP error: ${res.status}`);
            }
            return yield res.json();
        }
        catch (err) {
            console.error('Failed to fetch favorite products:', err);
            throw err;
        }
    });
}
