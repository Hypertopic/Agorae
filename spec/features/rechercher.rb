require 'spec_helper'

feature 'Rechercher par attributs' do

  scenario 'Pour une uv avec un projet' do
    visit '/'
    click_on 'Rechercher par attributs'
    select('UV', :from => 'Corpus')
    select('Nom', :from => 'Evaluation')
    select('Valeur', :from => 'Projet')
    click_on 'Rechercher'
    expect(page).to have_content 'IF05 - Qualité du logiciel'
  end

end
