require 'spec_helper'

feature 'Watch UV' do

    given(:viewpoint_name) { a_string }

    background do
        visit $home_page
        click_on 'Se connecter'
        log_in_as 'alice', 'lapinblanc'
        toggle_edit
        click_plus_sign_next_to 'viewpoint'
        click_last 'viewpoint'
        type viewpoint_name, :return
        expect(page).to have_content(viewpoint_name)
        toggle_edit
    end

    scenario 'view an UV informations' do
        click_on viewpoint_name
        page.should have_content 'Thèmes'
    end

end