require 'spec_helper'

feature 'Search by attribute' do

background do
visit '/'
click_on 'Rechercher par attributs'
end

scenario 'search by evaluation' do

select 'UV'
select 'Évaluation'
select 'Médian'
click_on 'Rechercher'
expect(page).to have_content 'NF19 – Admitration et virtualisation des systèmes et des bases de données'
end

scenario 'search by responsable and intervenant' do
select 'UV'
select 'Responsable'
select 'Aurélien Bénel'
click_on 'Rechercher'
expect(page).to have_content 'IF14 – Analyse du système'
end
end