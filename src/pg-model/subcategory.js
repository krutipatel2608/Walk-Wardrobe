module.exports = (sequelize, Sequelize) => {
    const subcategory = sequelize.define(
        'subcategory',
        {
            subcategory_name : {
                type: Sequelize.STRING,
                notNul: true
            }
        },
        {
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            tableName: 'subcategory'
          }
    )

    subcategory.associate = models => {
        subcategory.belongsTo(models.category, {
            foreignKey: 'category_id',
            sourceKey: 'id'
        })
    }

    return subcategory
}

