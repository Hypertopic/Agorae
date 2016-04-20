require 'spec_helper'

feature 'Search by attribute' do

  background do
    visit '/'
    click_on 'Rechercher par attributs'
  end

  scenario 'search by evaluation' do

# il suffit de supprimer les ':from' pour que les tests marchent. En effet, les balises select ne contiennent pas d'id ou de label
    select 'UV', :from => 'Corpus :'
    select 'Évaluation', :from => 'Nom :'
    select 'Mini-projet', :from => 'Valeur :'
    click_on 'Rechercher'
    expect(page).to have_content 'NF16 – Bases de données'
    expect(page).to have_content 'IF08 – Management de projets informatiques'
  end

  scenario 'search by responsable and intervenant' do
  select 'UV', :from => 'Corpus :'
  select 'Responsable', :from => 'Nom :'
  select 'Matthieu Tixier', :from => 'Valeur :'
  click_on '+'
  select 'Intervenant', :from => 'Nom :'
  select 'Jean-Pierre Cahier', :from => 'Valeur :'
  click_on 'Rechercher'
  expect(page).to have_content 'LO10 – Approches orientées services'
  end
end
