module.exports = (sequelize,Sequelize) => {
    const attendance = sequelize.define(
        'attendance',
        {
            date: {
                type: Sequelize.DATEONLY,
                notNull: true,
                // defaultValue: Sequelize.NOW
            },
            in_time: {
                type: Sequelize.TIME
            },
            out_time: {
                type: Sequelize.TIME
            },
            notes: {
                type: Sequelize.STRING
            },
            status: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'Present',
                validate: {
                    customValidator: value => {
                        const enums = ['Present', 'Absent', 'HalfDay', 'Working', 'Weekend'];
                        if(!enums.includes(value)){
                            throw new Error('not a valid option')
                        }
                    }
                }
            },
            is_checkIn: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                notNull: true
            },
            time_duration: {
                type: Sequelize.STRING
            }
        },
        {
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            tableName: 'attendance'
        }
    )

    attendance.associate = models => {
        attendance.belongsTo(models.staff, {
          foreignKey: 'staff_id',
          targetKey: 'id'
        })

      }

      return  attendance
}