import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    // Hoocks são utilizados para executar antes de alguma ação do usuario
    this.addHook('beforeSave', async user => {
      // foi definido que quando um usuario der save e estiver adicionando
      // ou Editando sua senha, sera gerada uma criptografia
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPasssword(password) {
    // retorna true ou false se as senhas batem
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
