feature 'Research by attribute' do

    scenario 'for search UV by responsable' do
        visit '/'
        click_on 'Rechercher par attributs'
        select 'UV', :from => 'Corpus'
        select 'Responsable', :from => 'Nom'
        select 'Aurélien BENEL', :from => 'Valeur'
        click_on 'Rechercher'
        click_on 'IF14...'
    end
    
    scenario 'for search UV by two intervenants' do
        visit '/'
        click_on 'Rechercher par attributs'
        select 'UV', :from => 'Corpus'
        select 'Intervenant', :from => 'Nom'
        select 'Ines Di Loreto', :from => 'Valeur'
        click_on '+'
        select 'Intervenant', :from => 'Nom'
        select 'Pascal Salembier', :from => 'Valeur'
        click_on 'Rechercher'
        click_on 'IF10...'
    end
end
