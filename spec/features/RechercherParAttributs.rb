require 'spec_helper'

feature 'Chercher un item par ses attributs' do

  background do

  end

  scenario 'en utilisant un seul attribut' do
    visit '/'
    click_on 'Rechercher par attributs'
    select 'UV', :from => 'Corpus'
    select 'Evaluation', :from => 'Nom'
    select 'Median', :from => 'Valeur'
    click_on 'Rechercher'
    click_on 'NF19 - Administration et virtualisation ...'
    return true
  end

  scenario 'en utilisant deux attributs' do
    visit '/'
    click_on 'Rechercher par attributs'
    select 'UV', :from => 'Corpus'
    select 'Evaluation', :from => 'Nom du premier attribut'
    select 'Median', :from => 'Valeur du premier attribut'
    click_plus_sign_search_by_attributs

    click_on 'Rechercher'
    click_on 'NF19 - Administration et virtualisation ...'
    return true
  end

end
