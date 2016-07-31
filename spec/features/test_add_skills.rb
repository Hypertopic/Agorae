require 'spec_helper'

feature 'Ajouter une compétence' do
  given(:topic_name) { a_string }

  scenario 'Lorsque l utilisateur est connecté' do
    visit $home_page
    click_on 'Se connecter'
    log_in_as 'alice', 'lapinblanc'
		click_on_link 'Competences'
    toggle_edit
    click_plus_sign_next_to 'topic'
    click_last 'topic'
    type topic_name, :return
    
		expect(page).to have_content(topic_name)
  end
end
