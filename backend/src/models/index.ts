import { Admin } from "./admin.model.ts";
import { Category } from "./category.model.ts";
import { CategoryTranslation } from "./category-translation.model.ts";
import { Product } from "./product.model.ts";
import { ProductTranslation } from "./product-translation.model.ts";
import { Translation } from "./translation.model.ts";
import { SiteContent } from "./site-content.model.ts";

Category.hasMany(CategoryTranslation, { foreignKey: "categoryId" });
CategoryTranslation.belongsTo(Category, { foreignKey: "categoryId" });

Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

Product.hasMany(ProductTranslation, { foreignKey: "productId" });
ProductTranslation.belongsTo(Product, { foreignKey: "productId" });

export { Admin, Category, CategoryTranslation, Product, ProductTranslation, Translation, SiteContent };
