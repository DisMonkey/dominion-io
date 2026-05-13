import { cosmeticRelationship } from "../src/client/Cosmetics";
import { UserMeResponse } from "../src/core/ApiSchemas";

const product = { productId: "prod_123", priceId: "price_123", price: "$4.99" };

function makeUserMe(flares: string[]): UserMeResponse {
  return {
    player: { flares },
  } as unknown as UserMeResponse;
}

describe("cosmeticRelationship", () => {
  it("returns owned when user has wildcard flare", () => {
    expect(
      cosmeticRelationship(
        {
          wildcardFlare: "flag:*",
          requiredFlare: "flag:cool",
          product,
          priceSoft: undefined,
          priceHard: undefined,
          affiliateCode: null,
          itemAffiliateCode: null,
        },
        makeUserMe(["flag:*"]),
      ),
    ).toBe("owned");
  });

  it("returns owned when user has the specific flare", () => {
    expect(
      cosmeticRelationship(
        {
          wildcardFlare: "flag:*",
          requiredFlare: "flag:cool",
          product,
          priceSoft: undefined,
          priceHard: undefined,
          affiliateCode: null,
          itemAffiliateCode: null,
        },
        makeUserMe(["flag:cool"]),
      ),
    ).toBe("owned");
  });

  it("returns owned even when no product and user does not own it (everything is free)", () => {
    expect(
      cosmeticRelationship(
        {
          wildcardFlare: "flag:*",
          requiredFlare: "flag:cool",
          product: null,
          priceSoft: undefined,
          priceHard: undefined,
          affiliateCode: null,
          itemAffiliateCode: null,
        },
        makeUserMe([]),
      ),
    ).toBe("owned");
  });

  it("returns owned even when affiliate codes do not match (everything is free)", () => {
    expect(
      cosmeticRelationship(
        {
          wildcardFlare: "flag:*",
          requiredFlare: "flag:cool",
          product,
          priceSoft: undefined,
          priceHard: undefined,
          affiliateCode: "storeA",
          itemAffiliateCode: "storeB",
        },
        makeUserMe([]),
      ),
    ).toBe("owned");
  });

  it("returns owned when product exists (everything is free)", () => {
    expect(
      cosmeticRelationship(
        {
          wildcardFlare: "flag:*",
          requiredFlare: "flag:cool",
          product,
          priceSoft: undefined,
          priceHard: undefined,
          affiliateCode: null,
          itemAffiliateCode: null,
        },
        makeUserMe([]),
      ),
    ).toBe("owned");
  });

  it("returns owned when affiliate codes match (everything is free)", () => {
    expect(
      cosmeticRelationship(
        {
          wildcardFlare: "pattern:*",
          requiredFlare: "pattern:stripes:red",
          product,
          priceSoft: undefined,
          priceHard: undefined,
          affiliateCode: "storeA",
          itemAffiliateCode: "storeA",
        },
        makeUserMe([]),
      ),
    ).toBe("owned");
  });

  it("returns owned when user is not logged in and no product (everything is free)", () => {
    expect(
      cosmeticRelationship(
        {
          wildcardFlare: "flag:*",
          requiredFlare: "flag:cool",
          product: null,
          priceSoft: undefined,
          priceHard: undefined,
          affiliateCode: null,
          itemAffiliateCode: null,
        },
        false,
      ),
    ).toBe("owned");
  });

  it("returns owned when user is not logged in but product exists (everything is free)", () => {
    expect(
      cosmeticRelationship(
        {
          wildcardFlare: "flag:*",
          requiredFlare: "flag:cool",
          product,
          priceSoft: undefined,
          priceHard: undefined,
          affiliateCode: null,
          itemAffiliateCode: null,
        },
        false,
      ),
    ).toBe("owned");
  });

  it("returns owned when item has currency price and no product (everything is free)", () => {
    expect(
      cosmeticRelationship(
        {
          wildcardFlare: "flag:*",
          requiredFlare: "flag:cool",
          product: null,
          priceSoft: 100,
          affiliateCode: null,
          itemAffiliateCode: null,
        },
        makeUserMe([]),
      ),
    ).toBe("owned");
  });

  it("returns owned when item has currency price but affiliate codes do not match (everything is free)", () => {
    expect(
      cosmeticRelationship(
        {
          wildcardFlare: "flag:*",
          requiredFlare: "flag:cool",
          product: null,
          priceSoft: 100,
          priceHard: 50,
          affiliateCode: "storeA",
          itemAffiliateCode: "storeB",
        },
        makeUserMe([]),
      ),
    ).toBe("owned");
  });

  it("returns owned when user has wildcard flare for patterns", () => {
    expect(
      cosmeticRelationship(
        {
          wildcardFlare: "pattern:*",
          requiredFlare: "pattern:stripes:red",
          product,
          priceSoft: undefined,
          priceHard: undefined,
          affiliateCode: null,
          itemAffiliateCode: null,
        },
        makeUserMe(["pattern:*"]),
      ),
    ).toBe("owned");
  });
});
