require 'spec_helper'

feature 'Add ressource' do

  scenario 'secondaire' do
    visit $home_page
    click_on 'Se connecter'
    log_in_as 'alice', 'lapinblanc'
    click_on_span 'UV'
    click_on_span 'IF05 – Qualité du logiciel'
    toggle_edit
    click_plus_sign_next_to 'Ressources secondaires'
    fill_in "Nom", :with => "Github HyperTopic"
    fill_in "Adresse", :with => "https://github.com/Hypertopic"
    click_on 'Référencer'
    expect(page).to have_content("Github HyperTopic")
  end

end
