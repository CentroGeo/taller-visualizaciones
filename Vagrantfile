# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
	config.vm.provider "virtualbox" do |v|
		v.customize ["modifyvm", :id, "--memory", "1024"]
		v.customize ["modifyvm", :id, "--cpus", "1"]
		v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
	end
	
	# Every Vagrant virtual environment requires a box to build off of.

	# The url from where the 'config.vm.box' box will be fetched if it
	# doesn't already exist on the user's system.
	config.vm.box = "http://dev.centrogeo.org.mx/fossgis/viz-base-v0.2.box"

	# Boot with a GUI so you can see the screen. (Default is headless)
	# config.vm.boot_mode = :gui

	# Assign this VM to a host only network IP, allowing you to access it
	# via the IP.
	# config.vm.network "33.33.33.10"
	# Forward a port from the guest to the host, which allows for outside
	# computers to access the VM, whereas host only networking does not.
	# config.vm.forward_port "http", 80, 8080
	# Share an additional folder to the guest VM. The first argument is
	# an identifier, the second is the path on the guest to mount the
	# folder, and the third is the path on the host to the actual folder.

	config.vm.network "forwarded_port", guest: 80, host: 8181
	#config.vm.network "forwarded_port", guest: 8000, host: 8000
	#config.vm.network "forwarded_port", guest: 8181, host: 8181
	#config.vm.network :forwarded_port, host: 7111, guest: 5432
	#config.vm.network "forwarded_port", guest: 9999, host: 9999

	config.vm.synced_folder  "projects" , "/vagrant"
	#config.vm.synced_folder  "projects" , "/projects"
	# Enable provisioning with a shell script.
	#config.vm.provision :shell, :path => "install.sh"
end

