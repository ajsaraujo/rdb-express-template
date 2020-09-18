import { DataTypes, Model } from 'sequelize';

class Log extends Model {
    static init(sequelize) {
        super.init({
            content: DataTypes.STRING
        }, {
            sequelize,
            timestamps: true,
            createdAt: true,
            updatedAt: false
        });
    }
}

export default Log;
