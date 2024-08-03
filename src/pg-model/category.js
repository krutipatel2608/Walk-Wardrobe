
module.exports = (sequelize, Sequelize) => {
    const category = sequelize.define(
        'category',
        {
            category_name: {
                type: Sequelize.STRING,
                notNull: true
            }
        },
        {
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            tableName: 'category'
          }
    )

    category.associate = models => {
        category.hasMany(models.subcategory, {
            foreignKey: 'category_id',
            sourceKey: 'id'
        })
    }

    return category
}