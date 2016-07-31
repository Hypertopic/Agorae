require 'spec_helper'

feature 'Rechercher une compétence' do

  scenario 'Par le fil d\'ariane' do
    visit $home_page
    click_on 'Se connecter'
    log_in_as 'alice', 'lapinblanc'
		click_on_link 'Competences'
    click_on_link 'AngularJS'

		expect(page).to have_content('Baptiste BAINIER')
  end
end
