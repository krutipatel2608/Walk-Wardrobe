const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceModel = new Schema({
   date: Date,
   in_time: String,
   out_time: {
    type: String,
    default: null
   },
   notes: String,
   status: {
        type: String,
        enum : ['Present', 'Absent', 'HalfDay', 'Working', 'Weekend'],
        default: 'Present'
    }, 
    is_checkIn: {
        type: Boolean,
        default: true
    },
    time_duration: String,
    staff_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff'
    }
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
)

const attendenceModel = mongoose.model('attendance', attendanceModel)
module.exports = attendenceModel