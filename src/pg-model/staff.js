module.exports = (sequelize, Sequelize) => {
    const staff = sequelize.define(
        'staff', 
        {
            name: {
                type: Sequelize.STRING(250),
                notNull: true
            },
            address: {
                type: Sequelize.STRING(500),
                notNull: true
            },
            phone: {
                type: Sequelize.STRING(250),
                notNull: true,
                unique: true
            },
            email: {
                type: Sequelize.STRING(250),
                notNull: true,
                unique:true
            },
            password: {
                type: Sequelize.STRING(1000),
                notNull: true,
                unique: true
            },
            joining_date: {
                type: Sequelize.DATEONLY,
                notNull: true
            },
            salary: {
                type: Sequelize.STRING(10),
                notNull: true
            },
            image: {
                type: Sequelize.STRING(250),
                notNull: true
            },
            annual_leave: {
                type: Sequelize.STRING(10),
                notNull: true 
            }
        },
        {
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            tableName: 'staff'
          }
    )

    staff.associate = models => {
        staff.hasMany(models.attendance, {
            foreignKey: 'staff_id',
            sourceKey: 'id'
        })
    }

    return staff
}