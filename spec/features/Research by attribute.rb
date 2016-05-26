require 'spec_helper'

feature 'Research by attribute' do

    scenario 'by responsible' do
        visit '/'
        click_on 'Rechercher par attributs'
        select 'UV', :from => 'Corpus'
        select 'Responsable', :from => 'Nom'
        select 'Andrea Duhamel', :from => 'Valeur'
        click_on 'Rechercher'
        click_on 'NF20'
    end
    
    scenario 'by two intervenants' do
        visit '/'
        click_on 'Rechercher par attributs'
        select 'UV', :from => 'Corpus'
        select 'Intervenant', :from => 'Nom'
        select 'Aurélien Benel', :from => 'Valeur'
        click_on '+'
        select 'Intervenant', :from => 'Nom'
        select 'Guillaume Doyen', :from => 'Valeur'
        click_on 'Rechercher'
        click_on 'IF14'
    end
    
    scenario 'by Evaluation' do
        visit '/'
        click_on 'Rechercher par attributs'
        select 'UV', :from => 'Corpus'
        select 'Evaluation', :from => 'Nom'
        select 'Median', :from => 'Valeur'
        click_on 'Rechercher'
        click_on 'NF19'
    end
end
