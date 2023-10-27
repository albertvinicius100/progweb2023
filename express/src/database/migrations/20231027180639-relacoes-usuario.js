'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Users',{
      
    type: 'foreign key',
    fields: ['cursoId'],
    name: 'usuario_curso_fk',
    references:{
      table: 'Cursos',
      field: 'id'
    },
    onDelete: 'restrict',
    onUpdate: 'restrict'
    })
  },

  down: async (queryInterface, Sequelize)=>{
    await queryInterface.removeConstraint(
      'Users',
      'usuario_curso_fk'
    )
  }
};
