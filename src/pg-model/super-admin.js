module.exports = (sequelize, Sequelize) => {
    const superAdmin = sequelize.define(
        'super_admin', 
        {
            name: {
                type: Sequelize.STRING(150),
                notNull: true
            },
            email: {
                type: Sequelize.STRING(100),
                notNull: true,
                unique: true
            },
            phone_no: {
                type: Sequelize.STRING(10),
                notNull: true
            },
            password: {
                type: Sequelize.STRING(1000),
                unique: true
            }
        },
        {
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            tableName: 'super_admin'
        }
    )

    return superAdmin
} 