import { sequelize } from "../connection.ts";

import { Admin } from "./admin.model.ts";
import { Media } from "./media.model.ts";
import { AssetTranslation } from "./asset-translation.model.ts";
import { Category } from "./category.model.ts";
import { CategoryTranslation } from "./category-translation.model.ts";
import { Attribute } from "./attribute.model.ts";
import { AttributeTranslation } from "./attribute-translation.model.ts";
import { AttributeOption } from "./attribute-option.model.ts";
import { AttributeOptionTranslation } from "./attribute-option-translation.model.ts";
import { CategoryAttribute } from "./category-attribute.model.ts";
import { Product } from "./product.model.ts";
import { ProductTranslation } from "./product-translation.model.ts";
import { ProductImage } from "./product-image.model.ts";
import { Page } from "./page.model.ts";
import { PageTranslation } from "./page-translation.model.ts";
import { ContentBlock } from "./content-block.model.ts";
import { ContentBlockTranslation } from "./content-block-translation.model.ts";
import { NavigationItem } from "./navigation-item.model.ts";
import { NavigationItemTranslation } from "./navigation-item-translation.model.ts";
import { FooterColumn } from "./footer-column.model.ts";
import { FooterColumnTranslation } from "./footer-column-translation.model.ts";
import { FooterLink } from "./footer-link.model.ts";
import { FooterLinkTranslation } from "./footer-link-translation.model.ts";
import { SiteSettings } from "./site-settings.model.ts";
import { SiteSettingsTranslation } from "./site-settings-translation.model.ts";

// Media
Admin.hasMany(Media, { foreignKey: "uploadedById", as: "uploadedMedia" });
Media.belongsTo(Admin, { foreignKey: "uploadedById", as: "uploadedBy" });
Media.hasMany(AssetTranslation, { foreignKey: "assetId", as: "translations" });
AssetTranslation.belongsTo(Media, { foreignKey: "assetId", as: "asset" });

// Category
Category.belongsTo(Category, { foreignKey: "parentId", as: "parent" });
Category.hasMany(Category, { foreignKey: "parentId", as: "children" });
Category.belongsTo(Media, { foreignKey: "imageId", as: "image" });
Category.hasMany(CategoryTranslation, { foreignKey: "categoryId", as: "translations" });
CategoryTranslation.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

// Attributes / facets
Attribute.hasMany(AttributeTranslation, { foreignKey: "attributeId", as: "translations" });
AttributeTranslation.belongsTo(Attribute, { foreignKey: "attributeId", as: "attribute" });
Attribute.hasMany(AttributeOption, { foreignKey: "attributeId", as: "options" });
AttributeOption.belongsTo(Attribute, { foreignKey: "attributeId", as: "attribute" });
AttributeOption.hasMany(AttributeOptionTranslation, { foreignKey: "optionId", as: "translations" });
AttributeOptionTranslation.belongsTo(AttributeOption, { foreignKey: "optionId", as: "option" });

Category.belongsToMany(Attribute, {
  through: CategoryAttribute,
  foreignKey: "categoryId",
  otherKey: "attributeId",
  as: "attributes",
});
Attribute.belongsToMany(Category, {
  through: CategoryAttribute,
  foreignKey: "attributeId",
  otherKey: "categoryId",
  as: "categories",
});
CategoryAttribute.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
CategoryAttribute.belongsTo(Attribute, { foreignKey: "attributeId", as: "attribute" });

// Products
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Product.hasMany(ProductTranslation, { foreignKey: "productId", as: "translations" });
ProductTranslation.belongsTo(Product, { foreignKey: "productId", as: "product" });
Product.hasMany(ProductImage, { foreignKey: "productId", as: "images" });
ProductImage.belongsTo(Product, { foreignKey: "productId", as: "product" });
ProductImage.belongsTo(Media, { foreignKey: "mediaId", as: "media" });

// Pages / content blocks
Page.hasMany(PageTranslation, { foreignKey: "pageId", as: "translations" });
PageTranslation.belongsTo(Page, { foreignKey: "pageId", as: "page" });
PageTranslation.belongsTo(Media, { foreignKey: "ogImageId", as: "ogImage" });
Page.hasMany(ContentBlock, { foreignKey: "pageId", as: "blocks" });
ContentBlock.belongsTo(Page, { foreignKey: "pageId", as: "page" });
ContentBlock.hasMany(ContentBlockTranslation, { foreignKey: "blockId", as: "translations" });
ContentBlockTranslation.belongsTo(ContentBlock, { foreignKey: "blockId", as: "block" });

// Navigation
NavigationItem.belongsTo(NavigationItem, { foreignKey: "parentId", as: "parent" });
NavigationItem.hasMany(NavigationItem, { foreignKey: "parentId", as: "children" });
NavigationItem.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
NavigationItem.belongsTo(Page, { foreignKey: "pageId", as: "page" });
NavigationItem.hasMany(NavigationItemTranslation, { foreignKey: "navigationItemId", as: "translations" });
NavigationItemTranslation.belongsTo(NavigationItem, { foreignKey: "navigationItemId", as: "navigationItem" });

// Footer
FooterColumn.hasMany(FooterColumnTranslation, { foreignKey: "footerColumnId", as: "translations" });
FooterColumnTranslation.belongsTo(FooterColumn, { foreignKey: "footerColumnId", as: "footerColumn" });
FooterColumn.hasMany(FooterLink, { foreignKey: "footerColumnId", as: "links" });
FooterLink.belongsTo(FooterColumn, { foreignKey: "footerColumnId", as: "footerColumn" });
FooterLink.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
FooterLink.belongsTo(Page, { foreignKey: "pageId", as: "page" });
FooterLink.hasMany(FooterLinkTranslation, { foreignKey: "footerLinkId", as: "translations" });
FooterLinkTranslation.belongsTo(FooterLink, { foreignKey: "footerLinkId", as: "footerLink" });

// Site settings
SiteSettings.belongsTo(Media, { foreignKey: "logoMediaId", as: "logo" });
SiteSettings.hasMany(SiteSettingsTranslation, { foreignKey: "siteSettingsId", as: "translations" });
SiteSettingsTranslation.belongsTo(SiteSettings, { foreignKey: "siteSettingsId", as: "siteSettings" });

export {
  sequelize,
  Admin,
  Media,
  AssetTranslation,
  Category,
  CategoryTranslation,
  Attribute,
  AttributeTranslation,
  AttributeOption,
  AttributeOptionTranslation,
  CategoryAttribute,
  Product,
  ProductTranslation,
  ProductImage,
  Page,
  PageTranslation,
  ContentBlock,
  ContentBlockTranslation,
  NavigationItem,
  NavigationItemTranslation,
  FooterColumn,
  FooterColumnTranslation,
  FooterLink,
  FooterLinkTranslation,
  SiteSettings,
  SiteSettingsTranslation,
};
